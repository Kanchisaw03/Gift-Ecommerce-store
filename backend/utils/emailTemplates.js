/**
 * Email templates for various notifications
 */

/**
 * Generate order confirmation email template
 * @param {Object} order - Order details
 * @param {Object} user - User details
 * @returns {Object} - Email subject and HTML content
 */
exports.orderConfirmationTemplate = (order, user) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Calculate estimated delivery date (7 days from order date)
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  // Generate order items HTML
  const orderItemsHtml = order.items.map(item => {
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
          <div style="display: flex;">
            <div style="margin-right: 10px;">
              <img src="${item.product.images?.[0] || 'https://via.placeholder.com/50'}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover;">
            </div>
            <div>
              <p style="margin: 0; font-weight: 500;">${item.product.name}</p>
              ${item.variant ? `<p style="margin: 0; color: #666; font-size: 12px;">Variant: ${item.variant}</p>` : ''}
              <p style="margin: 0; color: #666; font-size: 12px;">Quantity: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `;
  }).join('');

  // Email subject
  const subject = `🎁 Order Confirmation #${order.orderNumber || order._id.substring(0, 8)} – Luxury Gift Store`;

  // Email HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; background-color: #111; color: #D4AF37; }
        .content { padding: 20px; background-color: #fff; }
        .footer { text-align: center; padding: 20px; background-color: #f5f5f5; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #D4AF37; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .order-summary { margin-top: 20px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
        .order-summary-header { background-color: #f5f5f5; padding: 10px; font-weight: bold; }
        .order-summary-content { padding: 10px; }
        .order-total { font-weight: bold; font-size: 16px; }
        .tracking-info { margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 4px; }
        .status-steps { display: flex; justify-content: space-between; margin-top: 15px; position: relative; }
        .status-step { text-align: center; z-index: 2; }
        .status-step-icon { width: 30px; height: 30px; border-radius: 50%; background-color: #ccc; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; }
        .status-step.active .status-step-icon { background-color: #D4AF37; }
        .status-step-label { font-size: 12px; }
        .status-line { position: absolute; top: 15px; left: 0; right: 0; height: 2px; background-color: #ccc; z-index: 1; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Luxury Gift Store</h1>
          <p style="margin: 5px 0 0;">Order Confirmation</p>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          
          <p>Thank you for your order! We're excited to confirm that your order has been received and is being processed.</p>
          
          <div class="order-summary">
            <div class="order-summary-header">
              Order #${order.orderNumber || order._id.substring(0, 8)} - Placed on ${formatDate(order.createdAt)}
            </div>
            
            <div class="order-summary-content">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 10px; border-bottom: 1px solid #e0e0e0;">Item</th>
                    <th style="text-align: right; padding: 10px; border-bottom: 1px solid #e0e0e0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 10px; text-align: right;">Subtotal:</td>
                    <td style="padding: 10px; text-align: right;">${formatCurrency(order.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right;">Shipping:</td>
                    <td style="padding: 10px; text-align: right;">${formatCurrency(order.shippingCost)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right;">Tax:</td>
                    <td style="padding: 10px; text-align: right;">${formatCurrency(order.tax)}</td>
                  </tr>
                  ${order.discount > 0 ? `
                  <tr>
                    <td style="padding: 10px; text-align: right;">Discount:</td>
                    <td style="padding: 10px; text-align: right;">-${formatCurrency(order.discount)}</td>
                  </tr>` : ''}
                  <tr class="order-total">
                    <td style="padding: 10px; text-align: right; border-top: 2px solid #e0e0e0;">Total:</td>
                    <td style="padding: 10px; text-align: right; border-top: 2px solid #e0e0e0;">${formatCurrency(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div class="tracking-info">
            <h3 style="margin-top: 0;">Delivery Information</h3>
            <p><strong>Estimated Delivery:</strong> ${formatDate(estimatedDelivery)}</p>
            <p><strong>Shipping Address:</strong><br>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
            
            <h4>Order Status</h4>
            <div class="status-steps">
              <div class="status-line"></div>
              <div class="status-step active">
                <div class="status-step-icon">✓</div>
                <div class="status-step-label">Order Placed</div>
              </div>
              <div class="status-step">
                <div class="status-step-icon">•</div>
                <div class="status-step-label">Processing</div>
              </div>
              <div class="status-step">
                <div class="status-step-icon">•</div>
                <div class="status-step-label">Shipped</div>
              </div>
              <div class="status-step">
                <div class="status-step-icon">•</div>
                <div class="status-step-label">Delivered</div>
              </div>
            </div>
          </div>
          
          <p style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/track-order/${order._id}" class="button">Track Your Order</a>
          </p>
          
          <p style="margin-top: 30px;">
            If you have any questions about your order, please contact our customer support team at <a href="mailto:support@luxurygiftstore.com">support@luxurygiftstore.com</a> or call us at +91-9876543210.
          </p>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Warm regards,<br>The Luxury Gift Store Team</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Luxury Gift Store. All rights reserved.</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/privacy-policy">Privacy Policy</a> | 
            <a href="${process.env.FRONTEND_URL}/terms-of-service">Terms of Service</a> | 
            <a href="${process.env.FRONTEND_URL}/contact">Contact Us</a>
          </p>
          <p>This email was sent to ${user.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html: htmlContent };
};

/**
 * Generate order status update email template
 * @param {Object} order - Order details
 * @param {Object} user - User details
 * @param {string} newStatus - New order status
 * @returns {Object} - Email subject and HTML content
 */
exports.orderStatusUpdateTemplate = (order, user, newStatus) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get status text and emoji
  const getStatusInfo = (status) => {
    switch (status) {
      case 'processing':
        return { emoji: '🔧', text: 'Your order is being processed' };
      case 'shipped':
        return { emoji: '🚚', text: 'Your order has been shipped' };
      case 'delivered':
        return { emoji: '✅', text: 'Your order has been delivered' };
      case 'cancelled':
        return { emoji: '❌', text: 'Your order has been cancelled' };
      default:
        return { emoji: '📦', text: 'Your order status has been updated' };
    }
  };

  const statusInfo = getStatusInfo(newStatus);

  // Email subject
  const subject = `${statusInfo.emoji} Order #${order.orderNumber || order._id.substring(0, 8)} ${statusInfo.text} – Luxury Gift Store`;

  // Email HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; background-color: #111; color: #D4AF37; }
        .content { padding: 20px; background-color: #fff; }
        .footer { text-align: center; padding: 20px; background-color: #f5f5f5; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #D4AF37; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .status-box { margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 4px; text-align: center; }
        .status-emoji { font-size: 48px; margin-bottom: 10px; }
        .status-text { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Luxury Gift Store</h1>
          <p style="margin: 5px 0 0;">Order Status Update</p>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          
          <p>We're writing to inform you that the status of your order #${order.orderNumber || order._id.substring(0, 8)} has been updated.</p>
          
          <div class="status-box">
            <div class="status-emoji">${statusInfo.emoji}</div>
            <div class="status-text">${statusInfo.text}</div>
            <p>Order #${order.orderNumber || order._id.substring(0, 8)}</p>
            <p>Placed on ${formatDate(order.createdAt)}</p>
          </div>
          
          ${newStatus === 'shipped' ? `
          <div style="margin: 20px 0;">
            <h3>Shipping Information</h3>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
            ${order.carrier ? `<p><strong>Carrier:</strong> ${order.carrier}</p>` : ''}
            <p><strong>Shipping Address:</strong><br>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          ` : ''}
          
          ${newStatus === 'cancelled' ? `
          <div style="margin: 20px 0;">
            <h3>Cancellation Information</h3>
            ${order.cancellationReason ? `<p><strong>Reason:</strong> ${order.cancellationReason}</p>` : ''}
            <p>If you have any questions about this cancellation, please contact our customer support.</p>
          </div>
          ` : ''}
          
          <p style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/track-order/${order._id}" class="button">Track Your Order</a>
          </p>
          
          <p style="margin-top: 30px;">
            If you have any questions, please contact our customer support team at <a href="mailto:support@luxurygiftstore.com">support@luxurygiftstore.com</a> or call us at +91-9876543210.
          </p>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Warm regards,<br>The Luxury Gift Store Team</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Luxury Gift Store. All rights reserved.</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/privacy-policy">Privacy Policy</a> | 
            <a href="${process.env.FRONTEND_URL}/terms-of-service">Terms of Service</a> | 
            <a href="${process.env.FRONTEND_URL}/contact">Contact Us</a>
          </p>
          <p>This email was sent to ${user.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html: htmlContent };
};
