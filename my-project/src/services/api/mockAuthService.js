/**
 * Mock Authentication Service for Development
 * This service provides mock authentication functionality for development purposes.
 * It simulates API responses without requiring a backend connection.
 */

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Test Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    avatar: 'default-avatar.jpg',
    isVerified: true,
    createdAt: new Date().toISOString(),
    buyerInfo: {
      totalOrders: 5,
      totalSpent: 1500
    },
    wishlist: []
  },
  {
    id: '2',
    name: 'Test Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    avatar: 'default-avatar.jpg',
    isVerified: true,
    createdAt: new Date().toISOString(),
    sellerInfo: {
      isApproved: true,
      businessName: 'Luxury Goods Co.',
      commission: 10
    }
  },
  {
    id: '3',
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'default-avatar.jpg',
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Test Super Admin',
    email: 'superadmin@example.com',
    password: 'password123',
    role: 'super_admin',
    avatar: 'default-avatar.jpg',
    isVerified: true,
    createdAt: new Date().toISOString()
  }
];

// Generate a mock token
const generateToken = (user) => {
  return `mock-token-${user.id}-${Date.now()}`;
};

// Helper to simulate API delay
const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Mock response
 */
export const register = async (userData) => {
  console.log('[MOCK] Registering user with data:', { ...userData, password: '***HIDDEN***' });
  
  // Simulate API delay
  await simulateApiDelay();
  
  // Check if email already exists
  const existingUser = mockUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw {
      message: 'Email already in use',
      status: 400,
      data: { error: 'Email already in use' }
    };
  }
  
  // Create new user
  const newUser = {
    id: `${mockUsers.length + 1}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'buyer',
    avatar: 'default-avatar.jpg',
    isVerified: true,
    createdAt: new Date().toISOString()
  };
  
  // Add role-specific data
  if (newUser.role === 'buyer') {
    newUser.buyerInfo = {
      totalOrders: 0,
      totalSpent: 0
    };
    newUser.wishlist = [];
  } else if (newUser.role === 'seller') {
    newUser.sellerInfo = {
      isApproved: true,
      businessName: userData.businessName || 'New Seller',
      commission: 10
    };
  }
  
  // Add to mock users (in a real app, this would persist to a database)
  mockUsers.push(newUser);
  
  // Generate tokens
  const token = generateToken(newUser);
  const refreshToken = generateToken(newUser);
  
  // Return user data without password
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    success: true,
    token,
    refreshToken,
    user: userWithoutPassword
  };
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Mock response
 */
export const login = async (credentials) => {
  console.log('[MOCK] Attempting login with credentials:', { email: credentials.email });
  
  // Simulate API delay
  await simulateApiDelay();
  
  // Find user by email
  const user = mockUsers.find(user => user.email === credentials.email);
  
  // Check if user exists and password matches
  if (!user || user.password !== credentials.password) {
    throw {
      message: 'Invalid credentials',
      status: 401,
      data: { error: 'Invalid credentials' }
    };
  }
  
  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateToken(user);
  
  // Return user data without password
  const { password, ...userWithoutPassword } = user;
  
  return {
    success: true,
    token,
    refreshToken,
    user: userWithoutPassword
  };
};

/**
 * Logout user
 * @returns {Promise} - Mock response
 */
export const logout = async () => {
  console.log('[MOCK] Logging out user');
  
  // Simulate API delay
  await simulateApiDelay();
  
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

/**
 * Get current user profile
 * @returns {Promise} - Mock response
 */
export const getCurrentUser = async () => {
  console.log('[MOCK] Getting current user profile');
  
  // Simulate API delay
  await simulateApiDelay();
  
  // Get user from localStorage
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    throw {
      message: 'Not authenticated',
      status: 401,
      data: { error: 'Not authenticated' }
    };
  }
  
  const user = JSON.parse(userJson);
  
  return {
    success: true,
    data: user
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

/**
 * Get stored user data
 * @returns {Object|null} - User data or null
 */
export const getStoredUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Get user role
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const user = getStoredUser();
  return user ? user.role : null;
};

// Export all functions
export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
  getUserRole
};
