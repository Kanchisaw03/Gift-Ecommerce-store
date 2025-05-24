import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const AdminSellerManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sellers, setSellers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch sellers data
  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock sellers data
        const mockActiveSellers = [
          {
            id: 'S001',
            name: 'Luxury Artisan',
            owner: 'Alexander Wilson',
            email: 'contact@luxuryartisan.com',
            phone: '+1 (555) 123-4567',
            dateJoined: '2025-01-15',
            status: 'active',
            productsCount: 24,
            totalSales: 12850,
            rating: 4.7,
            verified: true
          },
          {
            id: 'S002',
            name: 'Elite Timepieces',
            owner: 'Sophia Martinez',
            email: 'sophia@elitetimepieces.com',
            phone: '+1 (555) 987-6543',
            dateJoined: '2025-02-10',
            status: 'active',
            productsCount: 18,
            totalSales: 24500,
            rating: 4.9,
            verified: true
          },
          {
            id: 'S003',
            name: 'Opulent Leathers',
            owner: 'James Thompson',
            email: 'james@opulentleathers.com',
            phone: '+1 (555) 456-7890',
            dateJoined: '2025-03-05',
            status: 'active',
            productsCount: 32,
            totalSales: 18200,
            rating: 4.5,
            verified: true
          },
          {
            id: 'S004',
            name: 'Crystal Elegance',
            owner: 'Emma Johnson',
            email: 'emma@crystalelegance.com',
            phone: '+1 (555) 234-5678',
            dateJoined: '2025-03-22',
            status: 'active',
            productsCount: 15,
            totalSales: 9800,
            rating: 4.6,
            verified: true
          },
          {
            id: 'S005',
            name: 'Silk & Cashmere',
            owner: 'William Davis',
            email: 'william@silkcashmere.com',
            phone: '+1 (555) 876-5432',
            dateJoined: '2025-04-08',
            status: 'suspended',
            productsCount: 27,
            totalSales: 15600,
            rating: 4.2,
            verified: true
          }
        ];
        
        const mockPendingSellers = [
          {
            id: 'S006',
            name: 'Artisanal Pens',
            owner: 'Oliver Brown',
            email: 'oliver@artisanalpens.com',
            phone: '+1 (555) 345-6789',
            dateApplied: '2025-05-18',
            status: 'pending',
            businessDescription: 'Handcrafted luxury writing instruments made with exotic woods and precious metals.',
            website: 'www.artisanalpens.com',
            documents: ['business_license.pdf', 'tax_id.pdf']
          },
          {
            id: 'S007',
            name: 'Vintage Treasures',
            owner: 'Charlotte Wilson',
            email: 'charlotte@vintagetreasures.com',
            phone: '+1 (555) 567-8901',
            dateApplied: '2025-05-19',
            status: 'pending',
            businessDescription: 'Curated collection of vintage luxury items including jewelry, watches, and accessories.',
            website: 'www.vintagetreasures.com',
            documents: ['business_license.pdf', 'product_catalog.pdf']
          }
        ];
        
        setSellers(mockActiveSellers);
        setPendingSellers(mockPendingSellers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        setIsLoading(false);
      }
    };
    
    fetchSellers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApproveSeller = async (sellerId) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update pending sellers list
      const updatedPendingSellers = pendingSellers.filter(seller => seller.id !== sellerId);
      setPendingSellers(updatedPendingSellers);
      
      // Get the approved seller
      const approvedSeller = pendingSellers.find(seller => seller.id === sellerId);
      
      // Add to active sellers with additional fields
      if (approvedSeller) {
        const newSeller = {
          ...approvedSeller,
          dateJoined: new Date().toISOString().split('T')[0],
          status: 'active',
          productsCount: 0,
          totalSales: 0,
          rating: 0,
          verified: true
        };
        
        setSellers([...sellers, newSeller]);
      }
    } catch (error) {
      console.error('Error approving seller:', error);
    }
  };

  const handleRejectSeller = async (sellerId) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update pending sellers list
      const updatedPendingSellers = pendingSellers.filter(seller => seller.id !== sellerId);
      setPendingSellers(updatedPendingSellers);
      
      // Close modal and reset
      setIsModalOpen(false);
      setSelectedSeller(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting seller:', error);
    }
  };

  const handleToggleStatus = async (sellerId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update sellers list
      const updatedSellers = sellers.map(seller => {
        if (seller.id === sellerId) {
          return {
            ...seller,
            status: currentStatus === 'active' ? 'suspended' : 'active'
          };
        }
        return seller;
      });
      
      setSellers(updatedSellers);
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  const openRejectModal = (seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
    setRejectionReason('');
  };

  const filteredSellers = sellers.filter(seller => {
    // Filter by status
    if (activeTab === 'active' && seller.status !== 'active') return false;
    if (activeTab === 'suspended' && seller.status !== 'suspended') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        seller.name.toLowerCase().includes(query) ||
        seller.owner.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query) ||
        seller.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]" />
            <div className="absolute inset-0 animate-ping opacity-30 rounded-full h-16 w-16 border border-[#D4AF37]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h1 className="text-3xl font-playfair font-bold mb-8">Seller Management</h1>

        {/* Pending Seller Applications */}
        {pendingSellers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-playfair font-semibold mb-4">Pending Applications ({pendingSellers.length})</h2>
            <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1E1E1E] border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Seller</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Business</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Contact</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date Applied</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {pendingSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium">{seller.name}</p>
                            <p className="text-xs text-gray-400">ID: {seller.id}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm line-clamp-2">{seller.businessDescription}</p>
                          {seller.website && (
                            <a href={`https://${seller.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4AF37] hover:underline">
                              {seller.website}
                            </a>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm">{seller.owner}</p>
                          <p className="text-xs text-gray-400">{seller.email}</p>
                          <p className="text-xs text-gray-400">{seller.phone}</p>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          {new Date(seller.dateApplied).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveSeller(seller.id)}
                              className="px-3 py-1 bg-green-900 text-green-300 rounded hover:bg-green-800 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(seller)}
                              className="px-3 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sellers List */}
        <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center">
          <div className="flex mb-4 md:mb-0">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${activeTab === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('all')}
            >
              All Sellers
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'active' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${activeTab === 'suspended' ? 'bg-[#D4AF37] text-black' : 'bg-[#1E1E1E] text-white hover:bg-gray-800'}`}
              onClick={() => setActiveTab('suspended')}
            >
              Suspended
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-64 bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Seller</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Contact</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Date Joined</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Products</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Sales</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Rating</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <p className="text-xs text-gray-400">ID: {seller.id}</p>
                        {seller.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300 mt-1">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm">{seller.owner}</p>
                      <p className="text-xs text-gray-400">{seller.email}</p>
                      <p className="text-xs text-gray-400">{seller.phone}</p>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {new Date(seller.dateJoined).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm">{seller.productsCount}</td>
                    <td className="py-4 px-6 text-sm">${seller.totalSales.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-1">{seller.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${seller.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {seller.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(seller.id, seller.status)}
                          className={`px-3 py-1 rounded ${seller.status === 'active' ? 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800' : 'bg-green-900 text-green-300 hover:bg-green-800'} transition-colors`}
                        >
                          {seller.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          className="px-3 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSellers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No sellers found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {isModalOpen && selectedSeller && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#121212] rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-playfair font-semibold mb-4">Reject Seller Application</h2>
              <p className="mb-4">You are about to reject the application from <span className="font-medium">{selectedSeller.name}</span>.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Rejection (Optional)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Provide a reason for rejection..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectSeller(selectedSeller.id)}
                  className="px-4 py-2 bg-red-900 text-red-300 rounded-md hover:bg-red-800 transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminSellerManagement;
