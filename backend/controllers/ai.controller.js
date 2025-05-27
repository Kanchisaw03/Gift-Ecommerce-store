const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Coupon = require('../models/coupon.model');
const Category = require('../models/category.model');
const ChatLog = require('../models/chatLog.model');
const { v4: uuidv4 } = require('uuid');

// Import Cohere client
const { CohereClient } = require('cohere-ai');

// Initialize Cohere client with API key
const cohereClient = new CohereClient({
  token: process.env.COHERE_API_KEY,
  apiUrl: 'https://api.cohere.ai'
});
// @desc    Process AI chat request
// @route   POST /api/ai/chat
// @access  Public (with rate limiting)
exports.processChat = asyncHandler(async (req, res, next) => {
  const { message, chatHistory = [], userId, userRole = 'guest', sessionId } = req.body;
  
  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }

  // Generate a session ID if not provided for conversation tracking
  const conversationId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Prepare context based on the message content
  let context = '';
  let additionalData = {};
  
  // Check if message is about products or categories
  if (message.toLowerCase().includes('product') || 
      message.toLowerCase().includes('category') ||
      message.toLowerCase().includes('gift') ||
      message.toLowerCase().includes('recommend') ||
      message.toLowerCase().includes('suggestion')) {
    // Fetch relevant product data
    const products = await Product.find({ isActive: true })
      .select('name description price category tags')
      .limit(10)
      .populate('category', 'name');
    
    additionalData.products = products;
    context += `\nAvailable products: ${JSON.stringify(products.map(p => ({ 
      name: p.name, 
      price: p.price, 
      description: p.description.substring(0, 100) + '...', 
      category: p.category?.name || 'Uncategorized',
      tags: p.tags
    })))}`;
  }

  // Check if message is about order tracking
  if (message.toLowerCase().includes('order') && 
      message.toLowerCase().includes('track')) {
    // Extract order ID if present in the message
    const orderIdMatch = message.match(/\b([A-Za-z0-9]{6,})\b/);
    if (orderIdMatch && userId) {
      try {
        const order = await Order.findOne({
          $or: [
            { _id: orderIdMatch[1] },
            { orderNumber: orderIdMatch[1] }
          ],
          user: userId
        }).populate('items.product', 'name');
        
        if (order) {
          additionalData.order = order;
          context += `\nOrder information: ${JSON.stringify({
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.items.map(item => item.name),
            total: order.totalAmount,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress
          })}`;
        } else {
          context += '\nOrder not found or does not belong to this user.';
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        context += '\nUnable to fetch order information. Please provide a valid order ID.';
      }
    } else if (!userId) {
      context += '\nUser needs to be logged in to track orders.';
    }
  }

  // Check if message is about coupons
  if (message.toLowerCase().includes('coupon') || 
      message.toLowerCase().includes('discount') ||
      message.toLowerCase().includes('promo')) {
    // Fetch active coupons
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).select('code type amount minPurchase maxDiscount description');
    
    additionalData.coupons = coupons;
    context += `\nAvailable coupons: ${JSON.stringify(coupons.map(c => ({
      code: c.code,
      type: c.type,
      amount: c.amount,
      minPurchase: c.minPurchase,
      description: c.description
    })))}`;
  }

  // System prompt with context about the e-commerce site
  const systemPrompt = `You are an AI shopping assistant for a luxury e-commerce website. 
  Your tone is helpful, knowledgeable, and slightly sophisticated to match the luxury brand image.
  
  You can help users with:
  1. Finding products and suggesting gift ideas
  2. Tracking their orders (if they provide an order ID and are logged in)
  3. Information about available coupons and discounts
  4. Guidance on using the website features like wishlist, cart, and checkout
  
  Current user role: ${userRole || 'guest'}
  ${context}`;

  try {
    // Log the chat request for debugging
    console.log('Chat request:', {
      userId,
      userRole,
      conversationId,
      message,
      timestamp: new Date().toISOString()
    });

    // Format chat history for Cohere
    const formattedChatHistory = chatHistory.map(msg => {
      return {
        role: msg.isUser ? 'USER' : 'CHATBOT',
        message: msg.text
      };
    });
    
    // Add additional instructions to system prompt
    const fullSystemPrompt = systemPrompt + 
      "\n\nAdditional instructions:\n" +
      "1. Keep responses concise and easy to read aloud since users may be using voice recognition.\n" +
      "2. Format responses with clear sections and bullet points when appropriate.\n" +
      "3. Avoid using complex symbols or characters that might be difficult to read aloud.\n" +
      "4. If the user is using voice input, be forgiving of minor spelling or grammar errors.";
    
    // Build a complete prompt with chat history for context
    console.log('Calling Cohere API with message:', message.substring(0, 50) + '...');
    
    // Prepare a simplified message for Cohere
    const chatMessages = [];
    
    // Add system message
    chatMessages.push({
      role: 'SYSTEM',
      message: fullSystemPrompt
    });
    
    // Add chat history (last 5 messages)
    if (chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-5);
      chatMessages.push(...recentHistory.map(msg => ({
        role: msg.isUser ? 'USER' : 'CHATBOT',
        message: msg.text
      })));
    }
    
    // Add current user message
    chatMessages.push({
      role: 'USER',
      message: message
    });
    
    // Define aiResponse variable outside the try block so it's accessible throughout the function
    let aiResponse = '';
    
    try {
      // Call Cohere API with simplified parameters
      const response = await cohereClient.chat({
        message: message,
        model: 'command',
        chatHistory: chatMessages.slice(1, -1), // Exclude system message and current message
        preamble: fullSystemPrompt,
      });
      
      console.log('Cohere API response received');
      console.log('Response structure:', Object.keys(response));
      
      // Extract the response text and assign it to the aiResponse variable
      aiResponse = response.text || 'I apologize, but I could not generate a response at this time.';
      console.log('AI response extracted successfully');
    } catch (apiError) {
      console.error('Error in Cohere API call:', apiError);
      throw apiError; // Re-throw to be caught by the outer try-catch
    }
    
    // Automatically log the interaction to the database
    try {
      await ChatLog.create({
        userId: userId || null,
        userRole: userRole || 'guest',
        sessionId: conversationId,
        message,
        response: aiResponse,
        feedback: 'none',
        metadata: {
          additionalDataProvided: Object.keys(additionalData),
          timestamp: new Date().toISOString(),
          isVoiceInput: req.body.isVoiceInput || false
        }
      });
    } catch (logError) {
      // Just log the error but don't fail the request
      console.error('Error logging chat interaction:', logError);
    }

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        additionalData,
        sessionId: conversationId
      }
    });
  } catch (error) {
    console.error('Cohere API Error:', error.message || JSON.stringify(error));
    
    // Provide a fallback response if the API fails
    return next(
      new ErrorResponse(
        'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment.',
        500
      )
    );
  }
});

// @desc    Get product suggestions based on criteria
// @route   POST /api/ai/suggestions
// @access  Public
exports.getProductSuggestions = asyncHandler(async (req, res, next) => {
  const { occasion, gender, ageRange, priceRange, interests } = req.body;
  
  // Build query based on provided criteria
  const query = { isActive: true };
  
  // Add tags based on occasion, gender, etc.
  const relevantTags = [];
  if (occasion) relevantTags.push(occasion.toLowerCase());
  if (gender) relevantTags.push(gender.toLowerCase());
  if (interests && interests.length) {
    relevantTags.push(...interests.map(i => i.toLowerCase()));
  }
  
  if (relevantTags.length > 0) {
    query.tags = { $in: relevantTags };
  }
  
  // Add price range if provided
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      query.price = { $gte: min, $lte: max };
    }
  }
  
  // Find matching products
  const products = await Product.find(query)
    .select('name description price images category tags')
    .populate('category', 'name')
    .limit(5);
  
  if (products.length === 0) {
    // If no exact matches, get some general recommendations
    const generalProducts = await Product.find({ isActive: true })
      .select('name description price images category tags')
      .sort({ rating: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      count: generalProducts.length,
      data: generalProducts,
      message: 'No exact matches found. Here are some of our popular items.'
    });
  } else {
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  }
});

// @desc    Log chat interaction for training
// @route   POST /api/ai/log
// @access  Public
exports.logChatInteraction = asyncHandler(async (req, res, next) => {
  const { userId, userRole, message, response, feedback, sessionId = uuidv4(), metadata = {} } = req.body;
  
  try {
    // Store the chat interaction in the database
    const chatLog = await ChatLog.create({
      userId: userId || null,
      userRole: userRole || 'guest',
      sessionId,
      message,
      response,
      feedback: feedback || 'none',
      metadata
    });
    
    console.log('Chat interaction logged:', {
      id: chatLog._id,
      userId,
      userRole,
      sessionId,
      feedback,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({
      success: true,
      message: 'Chat interaction logged successfully',
      data: { logId: chatLog._id }
    });
  } catch (error) {
    console.error('Error logging chat interaction:', error);
    // Don't return an error to the client, just log it
    res.status(200).json({
      success: false,
      message: 'Failed to log chat interaction'
    });
  }
});
