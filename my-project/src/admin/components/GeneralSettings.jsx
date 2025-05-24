import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

const GeneralSettings = () => {
  const fileInputRef = useRef(null);
  const [settings, setSettings] = useState({
    siteName: 'Luxury Gifts',
    siteTagline: 'Exquisite Gifts for Discerning Tastes',
    siteDescription: 'Premium luxury gift platform offering curated selections of high-end products from exclusive brands worldwide.',
    contactEmail: 'contact@luxurygifts.com',
    contactPhone: '+1 (800) 555-1234',
    contactAddress: '123 Luxury Avenue, New York, NY 10001',
    socialLinks: {
      facebook: 'https://facebook.com/luxurygifts',
      instagram: 'https://instagram.com/luxurygifts',
      twitter: 'https://twitter.com/luxurygifts',
      pinterest: 'https://pinterest.com/luxurygifts',
    },
    logoUrl: '/assets/images/logo.png',
    faviconUrl: '/assets/images/favicon.ico',
    primaryColor: '#D4AF37',
    secondaryColor: '#121212',
    accentColor: '#FFFFFF',
    fontHeading: 'Playfair Display',
    fontBody: 'Montserrat',
    enableDarkMode: true,
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'America/New_York',
    enableMaintenanceMode: false,
    maintenanceMessage: 'We are currently updating our site to serve you better. Please check back soon.',
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
    metaKeywords: 'luxury, gifts, premium, high-end, exclusive',
    enableCookieNotice: true,
    cookieNoticeText: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'
  });

  const [logoPreview, setLogoPreview] = useState(settings.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState(settings.faviconUrl);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSocialLinkChange = (platform, value) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        [platform]: value
      }
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setSettings({
          ...settings,
          logoUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result);
        setSettings({
          ...settings,
          faviconUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving general settings:', settings);
    // In a real app, this would be an API call
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Site Information */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Site Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site Tagline
            </label>
            <input
              type="text"
              name="siteTagline"
              value={settings.siteTagline}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Site Description
          </label>
          <textarea
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            rows="3"
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          ></textarea>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Contact Address
          </label>
          <input
            type="text"
            name="contactAddress"
            value={settings.contactAddress}
            onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Social Media Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={settings.socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={settings.socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Twitter
            </label>
            <input
              type="url"
              value={settings.socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Pinterest
            </label>
            <input
              type="url"
              value={settings.socialLinks.pinterest}
              onChange={(e) => handleSocialLinkChange('pinterest', e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Branding</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-md flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-500">No logo</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Upload Logo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">Recommended size: 200x60px</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-md flex items-center justify-center overflow-hidden">
                {faviconPreview ? (
                  <img src={faviconPreview} alt="Favicon Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-xs">No icon</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Upload Favicon
                </button>
                <input
                  type="file"
                  onChange={handleFaviconChange}
                  accept="image/x-icon,image/png"
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">Recommended size: 32x32px</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Primary Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-l-md border-0 p-0"
              />
              <input
                type="text"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="flex-grow bg-[#1E1E1E] border border-gray-700 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Secondary Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="secondaryColor"
                value={settings.secondaryColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-l-md border-0 p-0"
              />
              <input
                type="text"
                name="secondaryColor"
                value={settings.secondaryColor}
                onChange={handleChange}
                className="flex-grow bg-[#1E1E1E] border border-gray-700 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Accent Color
            </label>
            <div className="flex">
              <input
                type="color"
                name="accentColor"
                value={settings.accentColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-l-md border-0 p-0"
              />
              <input
                type="text"
                name="accentColor"
                value={settings.accentColor}
                onChange={handleChange}
                className="flex-grow bg-[#1E1E1E] border border-gray-700 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Heading Font
            </label>
            <select
              name="fontHeading"
              value={settings.fontHeading}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="Playfair Display">Playfair Display</option>
              <option value="Cormorant Garamond">Cormorant Garamond</option>
              <option value="Libre Baskerville">Libre Baskerville</option>
              <option value="Cinzel">Cinzel</option>
              <option value="Bodoni Moda">Bodoni Moda</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Body Font
            </label>
            <select
              name="fontBody"
              value={settings.fontBody}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="Montserrat">Montserrat</option>
              <option value="Raleway">Raleway</option>
              <option value="Lato">Lato</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Roboto">Roboto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Regional Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Default Language
            </label>
            <select
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date Format
            </label>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time Format
            </label>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Timezone
          </label>
          <select
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
          </select>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-playfair font-semibold text-white">Maintenance Mode</h3>
            <p className="text-sm text-gray-400">When enabled, visitors will see a maintenance message</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enableMaintenanceMode"
              checked={settings.enableMaintenanceMode}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
          </label>
        </div>
        
        {settings.enableMaintenanceMode && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Maintenance Message
            </label>
            <textarea
              name="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            ></textarea>
          </div>
        )}
      </div>

      {/* SEO & Analytics */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <h3 className="text-xl font-playfair font-semibold mb-4 text-white">SEO & Analytics</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Google Analytics ID
          </label>
          <input
            type="text"
            name="googleAnalyticsId"
            value={settings.googleAnalyticsId}
            onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            placeholder="UA-XXXXXXXXX-X"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Meta Keywords
          </label>
          <input
            type="text"
            name="metaKeywords"
            value={settings.metaKeywords}
            onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
        </div>
      </div>

      {/* Cookie Notice */}
      <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-playfair font-semibold text-white">Cookie Notice</h3>
            <p className="text-sm text-gray-400">Display a cookie consent notice to visitors</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enableCookieNotice"
              checked={settings.enableCookieNotice}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
          </label>
        </div>
        
        {settings.enableCookieNotice && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cookie Notice Text
            </label>
            <textarea
              name="cookieNoticeText"
              value={settings.cookieNoticeText}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            ></textarea>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 mr-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default GeneralSettings;
