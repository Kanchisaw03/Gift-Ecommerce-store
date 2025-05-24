import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SystemConfig = () => {
  const [apiKeys, setApiKeys] = useState({
    stripePublicKey: 'pk_test_51HxReiKFbGIY3U7U...',
    stripeSecretKey: '••••••••••••••••••••••••••',
    paypalClientId: 'AeH1yB4Uj-CbuJ_5...',
    paypalClientSecret: '••••••••••••••••••••••••••',
    googleMapsApiKey: 'AIzaSyC2HU7p...',
    mailchimpApiKey: '••••••••••••••••••••••••••',
    twilioAccountSid: 'AC5ef8732a3c49700f...',
    twilioAuthToken: '••••••••••••••••••••••••••',
    awsAccessKeyId: 'AKIA5TZ...',
    awsSecretAccessKey: '••••••••••••••••••••••••••'
  });

  const [integrations, setIntegrations] = useState({
    stripe: true,
    paypal: true,
    googleAnalytics: true,
    mailchimp: true,
    twilio: false,
    aws: true,
    facebook: true,
    instagram: false,
    twitter: true
  });

  const [cronJobs, setCronJobs] = useState([
    {
      id: 1,
      name: 'Database Backup',
      schedule: '0 0 * * *', // Daily at midnight
      lastRun: '2025-05-20 00:00:00',
      nextRun: '2025-05-21 00:00:00',
      status: 'success',
      command: 'backup:database',
      active: true
    },
    {
      id: 2,
      name: 'Order Status Update',
      schedule: '*/30 * * * *', // Every 30 minutes
      lastRun: '2025-05-21 14:30:00',
      nextRun: '2025-05-21 15:00:00',
      status: 'success',
      command: 'orders:update-status',
      active: true
    },
    {
      id: 3,
      name: 'Send Abandoned Cart Emails',
      schedule: '0 */3 * * *', // Every 3 hours
      lastRun: '2025-05-21 12:00:00',
      nextRun: '2025-05-21 15:00:00',
      status: 'success',
      command: 'cart:send-reminders',
      active: true
    },
    {
      id: 4,
      name: 'Clean Temporary Files',
      schedule: '0 2 * * *', // Daily at 2 AM
      lastRun: '2025-05-20 02:00:00',
      nextRun: '2025-05-21 02:00:00',
      status: 'success',
      command: 'files:clean-temp',
      active: true
    }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'error',
    maxUploadSize: 10, // MB
    sessionTimeout: 60, // minutes
    rateLimitRequests: 100,
    rateLimitWindow: 5, // minutes
    enableCache: true,
    cacheLifetime: 60, // minutes
    enableErrorReporting: true,
    errorReportingEmail: 'errors@luxurygifts.com'
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    backupStorage: 'aws',
    includeMedia: true,
    includeDatabase: true,
    backupTime: '00:00',
    lastBackup: '2025-05-20 00:00:00',
    nextBackup: '2025-05-21 00:00:00'
  });

  const handleApiKeyChange = (e) => {
    const { name, value } = e.target;
    setApiKeys({
      ...apiKeys,
      [name]: value
    });
  };

  const handleIntegrationToggle = (integration) => {
    setIntegrations({
      ...integrations,
      [integration]: !integrations[integration]
    });
  };

  const handleSystemSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleBackupSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBackupSettings({
      ...backupSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCronJobToggle = (id) => {
    setCronJobs(cronJobs.map(job => 
      job.id === id ? { ...job, active: !job.active } : job
    ));
  };

  const handleRunCronJob = (id) => {
    console.log(`Running cron job ${id}`);
    // In a real app, this would be an API call
  };

  const handleSaveSettings = () => {
    console.log('Saving system config settings');
    // In a real app, this would be an API call
  };

  return (
    <div className="bg-[#121212] rounded-lg shadow-xl p-6">
      <h3 className="text-xl font-playfair font-semibold mb-6 text-white">System Configuration</h3>
      
      {/* API Keys */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#D4AF37] mb-4">API Keys</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Stripe Public Key
            </label>
            <input
              type="text"
              name="stripePublicKey"
              value={apiKeys.stripePublicKey}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Stripe Secret Key
            </label>
            <input
              type="password"
              name="stripeSecretKey"
              value={apiKeys.stripeSecretKey}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              PayPal Client ID
            </label>
            <input
              type="text"
              name="paypalClientId"
              value={apiKeys.paypalClientId}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              PayPal Client Secret
            </label>
            <input
              type="password"
              name="paypalClientSecret"
              value={apiKeys.paypalClientSecret}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Google Maps API Key
            </label>
            <input
              type="text"
              name="googleMapsApiKey"
              value={apiKeys.googleMapsApiKey}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mailchimp API Key
            </label>
            <input
              type="password"
              name="mailchimpApiKey"
              value={apiKeys.mailchimpApiKey}
              onChange={handleApiKeyChange}
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>
      
      {/* Integrations */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#D4AF37] mb-4">Third-Party Integrations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(integrations).map(integration => (
            <div key={integration} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
              <div>
                <h5 className="font-medium text-white capitalize">{integration}</h5>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations[integration]}
                  onChange={() => handleIntegrationToggle(integration)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cron Jobs */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#D4AF37] mb-4">Scheduled Tasks</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E1E1E] border-b border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Task</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Schedule</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Last Run</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Next Run</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {cronJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{job.name}</p>
                      <p className="text-xs text-gray-400">{job.command}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{job.schedule}</td>
                  <td className="py-3 px-4 text-sm">{job.lastRun}</td>
                  <td className="py-3 px-4 text-sm">{job.nextRun}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {job.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRunCronJob(job.id)}
                        className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                      >
                        Run Now
                      </button>
                      <button
                        onClick={() => handleCronJobToggle(job.id)}
                        className={`px-2 py-1 rounded text-xs ${job.active ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}
                      >
                        {job.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* System Settings */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#D4AF37] mb-4">System Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Maintenance Mode</h5>
                <p className="text-xs text-gray-400">Site will be inaccessible to visitors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={systemSettings.maintenanceMode}
                  onChange={handleSystemSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Debug Mode</h5>
                <p className="text-xs text-gray-400">Show detailed error messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="debugMode"
                  checked={systemSettings.debugMode}
                  onChange={handleSystemSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Log Level
              </label>
              <select
                name="logLevel"
                value={systemSettings.logLevel}
                onChange={handleSystemSettingChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                name="maxUploadSize"
                value={systemSettings.maxUploadSize}
                onChange={handleSystemSettingChange}
                min="1"
                max="100"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                name="sessionTimeout"
                value={systemSettings.sessionTimeout}
                onChange={handleSystemSettingChange}
                min="5"
                max="1440"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Enable Caching</h5>
                <p className="text-xs text-gray-400">Improve performance with caching</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableCache"
                  checked={systemSettings.enableCache}
                  onChange={handleSystemSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {systemSettings.enableCache && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cache Lifetime (minutes)
                </label>
                <input
                  type="number"
                  name="cacheLifetime"
                  value={systemSettings.cacheLifetime}
                  onChange={handleSystemSettingChange}
                  min="1"
                  max="1440"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Error Reporting</h5>
                <p className="text-xs text-gray-400">Send error reports via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableErrorReporting"
                  checked={systemSettings.enableErrorReporting}
                  onChange={handleSystemSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {systemSettings.enableErrorReporting && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Error Reporting Email
                </label>
                <input
                  type="email"
                  name="errorReportingEmail"
                  value={systemSettings.errorReportingEmail}
                  onChange={handleSystemSettingChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Backup Settings */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#D4AF37] mb-4">Backup Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Automatic Backups</h5>
                <p className="text-xs text-gray-400">Schedule regular backups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoBackup"
                  checked={backupSettings.autoBackup}
                  onChange={handleBackupSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            {backupSettings.autoBackup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    name="backupFrequency"
                    value={backupSettings.backupFrequency}
                    onChange={handleBackupSettingChange}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    name="backupTime"
                    value={backupSettings.backupTime}
                    onChange={handleBackupSettingChange}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Backup Retention (days)
              </label>
              <input
                type="number"
                name="backupRetention"
                value={backupSettings.backupRetention}
                onChange={handleBackupSettingChange}
                min="1"
                max="365"
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Backup Storage
              </label>
              <select
                name="backupStorage"
                value={backupSettings.backupStorage}
                onChange={handleBackupSettingChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="local">Local Storage</option>
                <option value="aws">Amazon S3</option>
                <option value="google">Google Cloud Storage</option>
                <option value="azure">Azure Blob Storage</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Include Media Files</h5>
                <p className="text-xs text-gray-400">Backup images and uploads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="includeMedia"
                  checked={backupSettings.includeMedia}
                  onChange={handleBackupSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-white">Include Database</h5>
                <p className="text-xs text-gray-400">Backup database content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="includeDatabase"
                  checked={backupSettings.includeDatabase}
                  onChange={handleBackupSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
            
            <div className="bg-[#1A1A1A] p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Last Backup</p>
                  <p className="text-xs text-gray-400">{backupSettings.lastBackup}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Next Backup</p>
                  <p className="text-xs text-gray-400">{backupSettings.nextBackup}</p>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => console.log('Running manual backup')}
                  className="w-full px-3 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors text-sm font-medium"
                >
                  Run Manual Backup Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SystemConfig;
