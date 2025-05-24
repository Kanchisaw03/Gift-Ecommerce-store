const Setting = require('../models/setting.model');

/**
 * Settings Service
 * This service provides methods to manage application settings
 */
class SettingService {
  /**
   * Get a setting by key
   * @param {string} key - Setting key
   * @param {boolean} publicOnly - Whether to only return public settings
   * @returns {Promise<Object>} Setting object
   */
  static async getSetting(key, publicOnly = false) {
    try {
      const query = { key };
      
      if (publicOnly) {
        query.isPublic = true;
      }
      
      const setting = await Setting.findOne(query);
      return setting;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get setting value by key
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if setting not found
   * @param {boolean} publicOnly - Whether to only return public settings
   * @returns {Promise<*>} Setting value
   */
  static async getValue(key, defaultValue = null, publicOnly = false) {
    try {
      const setting = await this.getSetting(key, publicOnly);
      return setting ? setting.value : defaultValue;
    } catch (error) {
      console.error(`Error getting setting value ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Get multiple settings by group
   * @param {string} group - Setting group
   * @param {boolean} publicOnly - Whether to only return public settings
   * @returns {Promise<Array>} Array of settings
   */
  static async getSettingsByGroup(group, publicOnly = false) {
    try {
      const query = { group };
      
      if (publicOnly) {
        query.isPublic = true;
      }
      
      const settings = await Setting.find(query);
      return settings;
    } catch (error) {
      console.error(`Error getting settings for group ${group}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple settings by keys
   * @param {Array} keys - Array of setting keys
   * @param {boolean} publicOnly - Whether to only return public settings
   * @returns {Promise<Object>} Object with key-value pairs
   */
  static async getMultipleSettings(keys, publicOnly = false) {
    try {
      const query = { key: { $in: keys } };
      
      if (publicOnly) {
        query.isPublic = true;
      }
      
      const settings = await Setting.find(query);
      
      // Convert to key-value object
      const result = {};
      settings.forEach(setting => {
        result[setting.key] = setting.value;
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple settings:', error);
      throw error;
    }
  }

  /**
   * Set a setting value
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   * @param {Object} options - Additional options
   * @param {string} options.group - Setting group
   * @param {boolean} options.isPublic - Whether setting is public
   * @param {string} options.description - Setting description
   * @param {string} options.userId - User ID of updater
   * @returns {Promise<Object>} Updated setting
   */
  static async setSetting(key, value, options = {}) {
    try {
      const { group = 'other', isPublic = false, description = '', userId } = options;
      
      // Find setting or create if it doesn't exist
      let setting = await Setting.findOne({ key });
      
      if (setting) {
        // Update existing setting
        setting.value = value;
        
        if (group) setting.group = group;
        if (isPublic !== undefined) setting.isPublic = isPublic;
        if (description) setting.description = description;
        if (userId) setting.updatedBy = userId;
        
        setting.updatedAt = Date.now();
        
        await setting.save();
      } else {
        // Create new setting
        setting = await Setting.create({
          key,
          value,
          group,
          isPublic,
          description,
          createdBy: userId,
          updatedBy: userId
        });
      }
      
      return setting;
    } catch (error) {
      console.error(`Error setting value for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set multiple settings at once
   * @param {Object} settings - Object with key-value pairs
   * @param {Object} options - Additional options
   * @param {string} options.group - Setting group
   * @param {boolean} options.isPublic - Whether settings are public
   * @param {string} options.userId - User ID of updater
   * @returns {Promise<Array>} Array of updated settings
   */
  static async setMultipleSettings(settings, options = {}) {
    try {
      const { group, isPublic, userId } = options;
      const updatedSettings = [];
      
      for (const [key, value] of Object.entries(settings)) {
        const setting = await this.setSetting(key, value, {
          group,
          isPublic,
          userId
        });
        
        updatedSettings.push(setting);
      }
      
      return updatedSettings;
    } catch (error) {
      console.error('Error setting multiple settings:', error);
      throw error;
    }
  }

  /**
   * Delete a setting
   * @param {string} key - Setting key
   * @returns {Promise<boolean>} Whether setting was deleted
   */
  static async deleteSetting(key) {
    try {
      const result = await Setting.deleteOne({ key });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting setting ${key}:`, error);
      throw error;
    }
  }

  /**
   * Initialize default settings
   * @param {string} userId - User ID of creator
   * @returns {Promise<Array>} Array of created settings
   */
  static async initializeDefaultSettings(userId) {
    try {
      const defaultSettings = [
        // Site settings
        {
          key: 'site.name',
          value: 'Luxury E-Commerce',
          group: 'site',
          isPublic: true,
          description: 'Site name displayed in title and header'
        },
        {
          key: 'site.description',
          value: 'Premium luxury e-commerce platform for discerning customers',
          group: 'site',
          isPublic: true,
          description: 'Site meta description'
        },
        {
          key: 'site.logo',
          value: 'https://via.placeholder.com/200x80?text=Luxury+Logo',
          group: 'site',
          isPublic: true,
          description: 'Site logo URL'
        },
        {
          key: 'site.favicon',
          value: 'https://via.placeholder.com/32x32',
          group: 'site',
          isPublic: true,
          description: 'Site favicon URL'
        },
        {
          key: 'site.theme',
          value: 'dark',
          group: 'site',
          isPublic: true,
          description: 'Site default theme (light/dark)'
        },
        
        // Business settings
        {
          key: 'business.name',
          value: 'Luxury E-Commerce Inc.',
          group: 'business',
          isPublic: true,
          description: 'Legal business name'
        },
        {
          key: 'business.address',
          value: '123 Luxury Avenue, New York, NY 10001',
          group: 'business',
          isPublic: true,
          description: 'Business address'
        },
        {
          key: 'business.email',
          value: 'contact@luxuryecommerce.com',
          group: 'business',
          isPublic: true,
          description: 'Business contact email'
        },
        {
          key: 'business.phone',
          value: '+1 (800) 123-4567',
          group: 'business',
          isPublic: true,
          description: 'Business contact phone'
        },
        
        // Payment settings
        {
          key: 'payment.currency',
          value: 'USD',
          group: 'payment',
          isPublic: true,
          description: 'Default currency'
        },
        {
          key: 'payment.methods',
          value: ['credit_card', 'paypal'],
          group: 'payment',
          isPublic: true,
          description: 'Enabled payment methods'
        },
        {
          key: 'payment.stripe_public_key',
          value: 'pk_test_sample',
          group: 'payment',
          isPublic: true,
          description: 'Stripe public key'
        },
        {
          key: 'payment.stripe_secret_key',
          value: 'sk_test_sample',
          group: 'payment',
          isPublic: false,
          description: 'Stripe secret key'
        },
        
        // Shipping settings
        {
          key: 'shipping.countries',
          value: ['US', 'CA', 'UK', 'AU', 'FR', 'DE', 'IT', 'ES', 'JP'],
          group: 'shipping',
          isPublic: true,
          description: 'Countries available for shipping'
        },
        {
          key: 'shipping.free_threshold',
          value: 200,
          group: 'shipping',
          isPublic: true,
          description: 'Order amount for free shipping'
        },
        {
          key: 'shipping.methods',
          value: [
            { id: 'standard', name: 'Standard Shipping', price: 10, days: '3-5' },
            { id: 'express', name: 'Express Shipping', price: 25, days: '1-2' },
            { id: 'overnight', name: 'Overnight Shipping', price: 50, days: '1' }
          ],
          group: 'shipping',
          isPublic: true,
          description: 'Available shipping methods'
        },
        
        // Email settings
        {
          key: 'email.from',
          value: 'noreply@luxuryecommerce.com',
          group: 'email',
          isPublic: false,
          description: 'From email address'
        },
        {
          key: 'email.smtp_host',
          value: 'smtp.example.com',
          group: 'email',
          isPublic: false,
          description: 'SMTP host'
        },
        {
          key: 'email.smtp_port',
          value: 587,
          group: 'email',
          isPublic: false,
          description: 'SMTP port'
        },
        {
          key: 'email.smtp_user',
          value: 'smtp_user',
          group: 'email',
          isPublic: false,
          description: 'SMTP username'
        },
        {
          key: 'email.smtp_pass',
          value: 'smtp_password',
          group: 'email',
          isPublic: false,
          description: 'SMTP password'
        },
        
        // Social media settings
        {
          key: 'social.facebook',
          value: 'https://facebook.com/luxuryecommerce',
          group: 'social',
          isPublic: true,
          description: 'Facebook page URL'
        },
        {
          key: 'social.instagram',
          value: 'https://instagram.com/luxuryecommerce',
          group: 'social',
          isPublic: true,
          description: 'Instagram profile URL'
        },
        {
          key: 'social.twitter',
          value: 'https://twitter.com/luxuryecommerce',
          group: 'social',
          isPublic: true,
          description: 'Twitter profile URL'
        },
        
        // SEO settings
        {
          key: 'seo.title_template',
          value: '{page} | Luxury E-Commerce',
          group: 'seo',
          isPublic: true,
          description: 'Template for page titles'
        },
        {
          key: 'seo.meta_description',
          value: 'Discover premium luxury products at Luxury E-Commerce. Shop our curated collection of high-end fashion, accessories, and home decor.',
          group: 'seo',
          isPublic: true,
          description: 'Default meta description'
        },
        {
          key: 'seo.meta_keywords',
          value: 'luxury, premium, high-end, fashion, accessories, jewelry, watches, home decor',
          group: 'seo',
          isPublic: true,
          description: 'Default meta keywords'
        },
        
        // Commission settings
        {
          key: 'commission.default_rate',
          value: 10,
          group: 'commission',
          isPublic: false,
          description: 'Default commission rate for sellers (%)'
        },
        {
          key: 'commission.minimum',
          value: 5,
          group: 'commission',
          isPublic: false,
          description: 'Minimum commission rate (%)'
        },
        {
          key: 'commission.maximum',
          value: 20,
          group: 'commission',
          isPublic: false,
          description: 'Maximum commission rate (%)'
        },
        
        // Feature flags
        {
          key: 'features.reviews',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Enable product reviews'
        },
        {
          key: 'features.wishlist',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Enable wishlist functionality'
        },
        {
          key: 'features.coupons',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Enable coupon functionality'
        },
        {
          key: 'features.seller_applications',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Allow new seller applications'
        },
        {
          key: 'features.product_comparison',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Enable product comparison'
        },
        {
          key: 'features.dark_mode',
          value: true,
          group: 'features',
          isPublic: true,
          description: 'Enable dark mode toggle'
        }
      ];
      
      const createdSettings = [];
      
      for (const setting of defaultSettings) {
        // Check if setting already exists
        const existingSetting = await Setting.findOne({ key: setting.key });
        
        if (!existingSetting) {
          const createdSetting = await Setting.create({
            ...setting,
            createdBy: userId,
            updatedBy: userId
          });
          
          createdSettings.push(createdSetting);
        }
      }
      
      return createdSettings;
    } catch (error) {
      console.error('Error initializing default settings:', error);
      throw error;
    }
  }

  /**
   * Get all settings
   * @param {boolean} publicOnly - Whether to only return public settings
   * @returns {Promise<Array>} Array of settings
   */
  static async getAllSettings(publicOnly = false) {
    try {
      const query = publicOnly ? { isPublic: true } : {};
      const settings = await Setting.find(query);
      return settings;
    } catch (error) {
      console.error('Error getting all settings:', error);
      throw error;
    }
  }
}

module.exports = SettingService;
