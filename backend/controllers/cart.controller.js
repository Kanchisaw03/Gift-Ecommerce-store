const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Sync local cart with server cart
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items)) {
    return next(new ErrorResponse('Invalid cart data. Items must be an array.', 400));
  }
  
  console.log(`Syncing cart for user ${req.user.id} with ${items.length} items`);
  
  try {
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    // Track invalid products for user feedback
    const invalidProducts = [];
    const validProducts = [];
    
    // Process each item from the local cart
    for (const item of items) {
      const productId = item._id || item.id;
      const productName = item.name;
      const quantity = item.quantity || 1;
      
      // Skip items without ID or name
      if (!productId && !productName) {
        console.log('Skipping item without ID or name');
        invalidProducts.push({
          name: 'Unknown Product',
          reason: 'Missing product ID and name'
        });
        continue;
      }
      
      // Check if product exists
      let product;
      let validObjectId = false;
      
      // Validate ObjectId format
      if (productId) {
        validObjectId = mongoose.Types.ObjectId.isValid(productId);
        if (!validObjectId) {
          console.log(`Invalid ObjectId format: ${productId}`);
        }
      }
      
      // Try to find the product by ID first if it's a valid ObjectId
      if (productId && validObjectId) {
        product = await Product.findById(productId);
      }
      
      // If product not found by ID, try to find by name
      if (!product && productName) {
        console.log(`Product not found with id ${productId}, trying to find by name: ${productName}`);
        product = await Product.findOne({ name: new RegExp('^' + productName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') });
        
        // If exact match fails, try partial match
        if (!product) {
          product = await Product.findOne({ name: new RegExp(productName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') });
        }
      }
      
      // If product still not found
      if (!product) {
        console.log(`Product not found with id ${productId} or name ${productName}`);
        
        // In development mode, create a test product
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Creating test product for cart sync');
          try {
            product = await Product.create({
              name: productName || `Luxury Item ${Math.floor(Math.random() * 1000)}`,
              description: 'Automatically created test product',
              price: item.price || 999.99,
              stock: 100,
              status: 'approved', // Changed from 'active' to 'approved' to match the enum values
              seller: req.user.id,
              category: '6831ee54319db2b4b0e9295e' // Default category ID
            });
            console.log(`Created mock product with ID: ${product._id}`);
          } catch (createErr) {
            console.error('Error creating mock product:', createErr);
            invalidProducts.push({
              name: productName || 'Unknown Product',
              id: productId,
              reason: 'Failed to create mock product: ' + createErr.message
            });
            continue;
          }
        } else {
          console.log('Skipping item with non-existent product');
          invalidProducts.push({
            name: productName || 'Unknown Product',
            id: productId,
            reason: 'Product does not exist in database'
          });
          continue;
        }
      }
      
      // At this point we have a valid product
      validProducts.push({
        id: product._id,
        name: product.name
      });
      
      // Check if product is already in cart
      const existingItemIndex = cart.items.findIndex(cartItem => 
        cartItem.product && cartItem.product.toString() === product._id.toString()
      );
      
      // Get current price
      const price = product.onSale && product.salePrice > 0 
        ? product.salePrice 
        : product.price;
      
      if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        cart.items[existingItemIndex].quantity += quantity;
        console.log(`Updated quantity for existing item: ${product.name}`);
      } else {
        // Add new item to cart
        cart.items.push({
          product: product._id,
          quantity,
          price,
          name: product.name,
          image: product.images && product.images.length > 0 && product.images[0].url 
            ? product.images[0].url 
            : '/assets/images/product-placeholder.jpg',
          seller: product.seller,
          // Store original ID for reference if it wasn't a valid ObjectId
          mockId: !validObjectId ? productId : undefined
        });
        console.log(`Added new item to cart: ${product.name}`);
      }
    }
    
    // Save updated cart
    await cart.save();
    
    // Populate cart items with product details
    await cart.populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock status seller'
    });
    
    await cart.populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });
    
    // Prepare response with information about invalid products
    const responseMessage = invalidProducts.length > 0 
      ? `Cart synced with ${validProducts.length} valid products. ${invalidProducts.length} invalid products were removed.` 
      : 'Cart synced successfully';
    
    res.status(200).json({
      success: true,
      message: responseMessage,
      data: cart,
      validProducts,
      invalidProducts: invalidProducts.length > 0 ? invalidProducts : undefined
    });
  } catch (err) {
    console.error('Error syncing cart:', err);
    return next(new ErrorResponse(`Error syncing cart: ${err.message}`, 500));
  }
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock status seller'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if any products are out of stock or no longer available
  const updatedItems = [];
  let cartUpdated = false;

  for (const item of cart.items) {
    if (
      !item.product || 
      item.product.status !== 'approved' || 
      item.product.stock < item.quantity
    ) {
      cartUpdated = true;
      // Skip this item as it's no longer available or has insufficient stock
      continue;
    }

    // Update price if it has changed
    const currentPrice = item.product.onSale && item.product.salePrice > 0 
      ? item.product.salePrice 
      : item.product.price;

    if (item.price !== currentPrice) {
      item.price = currentPrice;
      cartUpdated = true;
    }

    updatedItems.push(item);
  }

  // Update cart if needed
  if (cartUpdated) {
    cart.items = updatedItems;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Validate input
  if (!productId) {
    return next(new ErrorResponse('Please provide a product ID', 400));
  }
  
  // Log the product ID for debugging
  console.log('Received product ID:', productId);
  console.log('Product ID type:', typeof productId);
  
  // For debugging - log all available products
  try {
    const allProducts = await Product.find().select('_id name productNumber customId').limit(5);
    console.log('Available products (sample):', JSON.stringify(allProducts));
  } catch (err) {
    console.error('Error listing products:', err.message);
  }

  // Find product - handle both ObjectId and numeric IDs
  let product;
  
  // Since we have no products in the database, let's create a development product
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Creating test product for cart');
    
    // Create a mock product with a valid ObjectId
    const mockProductId = new mongoose.Types.ObjectId();
    console.log('Created mock product with ID:', mockProductId);
    
    // Set the product with all required fields
    product = {
      _id: mockProductId,
      name: `Luxury Item ${productId}`,
      description: 'This is a luxury test product created for development',
      price: 999.99,
      stock: 100,
      status: 'approved',
      seller: req.user._id,
      images: [{ url: '/assets/images/product-placeholder.jpg' }]
    };
    
    console.log('Mock product created:', product.name);
  } else {
    // In production, try to find a real product
    try {
      // First approach: Try direct ObjectId lookup if valid
      if (mongoose.Types.ObjectId.isValid(productId)) {
        console.log('Trying to find product by ObjectId');
        product = await Product.findById(productId);
      }
      
      // Second approach: Try by productNumber
      if (!product) {
        console.log('Trying to find product by productNumber');
        product = await Product.findOne({ productNumber: productId });
      }
      
      // Third approach: Try by customId
      if (!product) {
        console.log('Trying to find product by customId');
        product = await Product.findOne({ customId: productId });
      }
    } catch (err) {
      console.error('Error finding product:', err.message);
      return next(new ErrorResponse(`Error finding product: ${err.message}`, 500));
    }
  }
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }
  
  console.log('Found product:', product.name, 'with ID:', product._id);

  // Check if product is approved and in stock
  if (product.status !== 'approved') {
    return next(new ErrorResponse('This product is not available for purchase', 400));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse(`Insufficient stock. Only ${product.stock} available.`, 400));
  }

  // Get current price
  const price = product.onSale && product.salePrice > 0 
    ? product.salePrice 
    : product.price;

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  // If cart doesn't exist, create one
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if product is already in cart
  const itemIndex = cart.items.findIndex(item => {
    return item.product && item.product.toString() === product._id.toString();
  });
  
  console.log('Cart items:', cart.items);
  console.log('Looking for product with ID:', product._id.toString());
  console.log('Item index in cart:', itemIndex);
  
  if (itemIndex > -1) {
    // Product exists in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Product is not in cart, add new item
    cart.items.push({
      product: product._id,
      quantity,
      price,
      name: product.name,
      image: product.images && product.images[0] ? product.images[0].url : '/assets/images/product-placeholder.jpg',
      seller: product.seller
    });
    
    console.log('Added new item to cart:', {
      product: product._id.toString(),
      quantity,
      price,
      name: product.name
    });
  }

  // Save cart
  await cart.save();

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  // Validate input
  if (!quantity || quantity < 1) {
    return next(new ErrorResponse('Please provide a valid quantity', 400));
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Get product to check stock
  const product = await Product.findById(cart.items[itemIndex].product);

  if (!product) {
    return next(new ErrorResponse('Product no longer exists', 404));
  }

  if (product.stock < quantity) {
    return next(new ErrorResponse(`Insufficient stock. Only ${product.stock} available.`, 400));
  }

  // Update item quantity
  cart.items[itemIndex].quantity = quantity;

  // Update price if it has changed
  const currentPrice = product.onSale && product.salePrice > 0 
    ? product.salePrice 
    : product.price;

  if (cart.items[itemIndex].price !== currentPrice) {
    cart.items[itemIndex].price = currentPrice;
  }

  // Save cart
  await cart.save();

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Remove item from cart
  cart.items.splice(itemIndex, 1);

  // Save cart
  await cart.save();

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  // Find and delete user's cart
  await Cart.findOneAndDelete({ user: req.user.id });

  // Create a new empty cart
  const cart = await Cart.create({
    user: req.user.id,
    items: []
  });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode } = req.body;

  // Validate input
  if (!couponCode) {
    return next(new ErrorResponse('Please provide a coupon code', 400));
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // TODO: Implement proper coupon validation against a Coupon model
  // For now, we'll use a simple hardcoded coupon for testing
  let couponDiscount = 0;

  if (couponCode.toLowerCase() === 'welcome10') {
    // 10% discount
    couponDiscount = cart.subtotal * 0.1;
  } else if (couponCode.toLowerCase() === 'luxury20') {
    // 20% discount
    couponDiscount = cart.subtotal * 0.2;
  } else if (couponCode.toLowerCase() === 'freeship') {
    // Free shipping (would be applied at checkout)
    couponDiscount = 0;
  } else {
    return next(new ErrorResponse('Invalid or expired coupon code', 400));
  }

  // Apply coupon to cart
  cart.couponCode = couponCode;
  cart.couponDiscount = couponDiscount;

  // Save cart
  await cart.save();

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/remove-coupon
// @access  Private
exports.removeCoupon = asyncHandler(async (req, res, next) => {
  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Remove coupon from cart
  cart.couponCode = undefined;
  cart.couponDiscount = 0;

  // Save cart
  await cart.save();

  // Return updated cart
  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name price salePrice onSale images stock'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: cart
  });
});
