const twilio = require('twilio');

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send SMS notification using Twilio
 * @param {Object} options - SMS options
 * @param {string} options.to - Recipient phone number (with country code)
 * @param {string} options.message - SMS message content
 * @returns {Promise} - Twilio response
 */
const sendSMS = async (options) => {
  try {
    // Check if Twilio credentials are configured
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.log('Twilio credentials not configured. SMS not sent.');
      return false;
    }

    // Create Twilio client
    const client = twilio(accountSid, authToken);

    // Format phone number (ensure it has country code)
    let phoneNumber = options.to;
    if (!phoneNumber.startsWith('+')) {
      // Default to India country code if not specified
      phoneNumber = `+91${phoneNumber}`;
    }

    // Send SMS
    const message = await client.messages.create({
      body: options.message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

module.exports = sendSMS;
