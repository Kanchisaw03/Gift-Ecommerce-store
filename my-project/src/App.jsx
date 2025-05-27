import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import luxury styles
import "./styles/luxuryStyles.css";

// Import ChatBot component
import ChatBot from "./components/ChatBot/ChatBot";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { UserProvider } from "./context/UserContext";
import { SellerProvider } from "./context/SellerContext";
import { AdminProvider } from "./context/AdminContext";
import { SuperAdminProvider } from "./context/SuperAdminContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CouponProvider } from "./context/CouponContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ROLES } from "./context/AuthContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";

// Public Pages
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import ProductListing from "./Pages/ProductListing";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import TrackOrder from "./Pages/TrackOrder";
import UserOrders from "./Pages/UserOrders";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import NotFound from "./Pages/NotFound";

// Auth Pages
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import ForgotPassword from "./auth/pages/ForgotPassword";
import Unauthorized from "./auth/pages/Unauthorized";

// Buyer Pages
import Profile from "./buyer/pages/Profile";
import OrderHistory from "./buyer/pages/OrderHistory";
import OrderDetails from "./buyer/pages/OrderDetails";
import AddressBook from "./buyer/pages/AddressBook";
import ReviewsRatings from "./buyer/pages/ReviewsRatings";
import Notifications from "./buyer/pages/Notifications";


// Seller Pages
import SellerDashboard from "./seller/pages/SellerDashboard";
import SellerProducts from "./seller/pages/SellerProducts";
import SellerAddProduct from "./seller/pages/SellerAddProduct";
import SellerEditProduct from "./seller/pages/SellerEditProduct";
import SellerOrders from "./seller/pages/SellerOrders";
import SellerOrderDetails from "./seller/pages/SellerOrderDetails";
import SellerAnalytics from "./seller/pages/SellerAnalytics";
import SellerEarnings from "./seller/pages/SellerEarnings";
import SellerSettings from "./seller/pages/SellerSettings";
import SellerCoupons from "./seller/pages/SellerCoupons";
import TestProductPage from "./seller/pages/TestProductPage";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProductManagement from "./admin/pages/AdminProductManagement";
import AdminUserManagement from "./admin/pages/AdminUserManagement";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminSellerManagement from "./admin/pages/AdminSellerManagement";
import AdminOrderManagement from "./admin/pages/AdminOrderManagement";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminReviewManagement from "./admin/pages/AdminReviewManagement";
import AdminAnalytics from "./admin/pages/AdminAnalytics";

// Super Admin Pages
import SuperAdminDashboard from "./admin/pages/SuperAdminDashboard";
import SuperAdminPage from "./admin/pages/SuperAdminPage";
import SuperAdminUserRoles from "./admin/pages/SuperAdminUserRoles";
import SuperAdminPlatformSettings from "./admin/pages/SuperAdminPlatformSettings";
import SuperAdminCategories from "./admin/pages/SuperAdminCategories";
import SuperAdminAuditLogs from "./admin/pages/SuperAdminAuditLogs";
import SuperAdminFeaturedProducts from "./admin/pages/SuperAdminFeaturedProducts";
import SuperAdminOrders from "./admin/pages/SuperAdminOrders";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 1 second
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle cart sidebar
  const toggleCart = () => setCartOpen(!cartOpen);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <CouponProvider>
                <UserProvider>
                  <SellerProvider>
                    <AdminProvider>
                      <SuperAdminProvider>
                        <NotificationProvider>
                          <ScrollToTop />
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white font-sans">
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Navbar toggleCart={toggleCart} />
          <main className="flex-grow w-full pt-20"> {/* Added top padding to account for fixed navbar */}
            {isLoading ? (
              <div className="flex items-center justify-center flex-grow h-screen bg-[#0A0A0A]">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]" />
                  <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-16 w-16 border border-[#D4AF37]" />
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/track-order/:orderId" element={<TrackOrder />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Buyer Routes */}
                  <Route path="/profile" element={<ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <Profile />
                  </ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <Notifications />
                  </ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <OrderHistory />
                  </ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={[ROLES.BUYER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <OrderDetails />
                  </ProtectedRoute>} />
                  
                  {/* Seller Routes */}
                  <Route path="/seller" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <SellerDashboard />
                  </ProtectedRoute>} />
                  <Route path="/seller/products" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <SellerProducts />
                  </ProtectedRoute>} />
                  <Route path="/seller/products/add" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <SellerAddProduct />
                  </ProtectedRoute>} />
                  <Route path="/seller/products/edit/:id" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                    <SellerEditProduct />
                  </ProtectedRoute>} />
                  <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerOrders /></ProtectedRoute>} />
                  <Route path="/seller/orders/:id" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerOrderDetails /></ProtectedRoute>} />
                  <Route path="/seller/analytics" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerAnalytics /></ProtectedRoute>} />
                  <Route path="/seller/earnings" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerEarnings /></ProtectedRoute>} />
                  <Route path="/seller/coupons" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerCoupons /></ProtectedRoute>} />
                  <Route path="/seller/settings" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><SellerSettings /></ProtectedRoute>} />
                  <Route path="/seller/test-product" element={<ProtectedRoute allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}><TestProductPage /></ProtectedRoute>} />
                  
                  {/* Admin Routes */}
                  {/* Protected routes with role-based access control */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminProductManagement /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminUserManagement /></ProtectedRoute>} />
                  <Route path="/admin/sellers" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminSellerManagement /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminOrders /></ProtectedRoute>} />
                  <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminReviewManagement /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminAnalytics /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminSettings /></ProtectedRoute>} />
                  
                  {/* Super Admin Routes */}
                  {/* Protected routes with role-based access control */}
                  <Route path="/superadmin" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/super" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminPage /></ProtectedRoute>} />
                  <Route path="/admin/super/user-roles" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminUserRoles /></ProtectedRoute>} />
                  <Route path="/admin/super/platform-settings" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminPlatformSettings /></ProtectedRoute>} />
                  <Route path="/admin/super/categories" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminCategories /></ProtectedRoute>} />
                  <Route path="/admin/super/audit-logs" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminAuditLogs /></ProtectedRoute>} />
                  <Route path="/admin/super/featured-products" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminFeaturedProducts /></ProtectedRoute>} />
                  <Route path="/admin/super/orders" element={<ProtectedRoute allowedRoles={ROLES.SUPER_ADMIN}><SuperAdminOrders /></ProtectedRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            )}
          </main>
          <Footer />
          <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          <ChatBot />
        </div>
                        </NotificationProvider>
                      </SuperAdminProvider>
                    </AdminProvider>
                  </SellerProvider>
                </UserProvider>
              </CouponProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
