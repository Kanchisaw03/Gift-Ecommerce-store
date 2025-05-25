import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import * as categoryService from '../../services/api/categoryService';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';

const SuperAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    featured: false,
    image: '',
    subcategories: []
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryService.getCategories();
        console.log('Categories API response:', response);
        
        // Format the data to match our component's expected structure
        const formattedCategories = Array.isArray(response) ? response : response.categories || [];
        
        // Set initial expanded categories
        if (formattedCategories.length > 0) {
          setExpandedCategories([formattedCategories[0]._id]);
        }
        
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleToggleExpand = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleEditSubcategory = (categoryId, subcategory) => {
    setEditingSubcategory({
      ...subcategory,
      categoryId
    });
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
  };

  const handleCancelEditSubcategory = () => {
    setEditingSubcategory(null);
  };

  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      
      // Make API call to update category
      await categoryService.updateCategory(editingCategory._id, {
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
        featured: editingCategory.featured,
        image: editingCategory.image
      });
      
      // Update local state
      const updatedCategories = categories.map(cat => {
        if (cat._id === editingCategory._id) {
          return { ...editingCategory };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubcategory = async () => {
    try {
      setLoading(true);
      
      // Make API call to update subcategory
      // Note: This assumes your API has an endpoint for updating subcategories
      // You may need to adjust this based on your actual API structure
      await categoryService.updateCategory(editingSubcategory.categoryId, {
        subcategory: {
          id: editingSubcategory._id,
          name: editingSubcategory.name,
          slug: editingSubcategory.slug
        }
      });
      
      // Update local state
      const updatedCategories = categories.map(category => 
        category._id === editingSubcategory.categoryId 
          ? {
              ...category,
              subcategories: category.subcategories.map(subcategory => 
                subcategory._id === editingSubcategory._id ? editingSubcategory : subcategory
              )
            }
          : category
      );
      
      setCategories(updatedCategories);
      setEditingSubcategory(null);
      toast.success('Subcategory updated successfully');
    } catch (err) {
      console.error('Error updating subcategory:', err);
      toast.error('Failed to update subcategory');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      // Make API call to delete category
      await categoryService.deleteCategory(id);
      
      // Update local state
      setCategories(categories.filter(category => category._id !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            subcategories: category.subcategories.filter(subcategory => subcategory.id !== subcategoryId)
          }
        : category
    ));
  };

  const handleAddNewCategory = async () => {
    try {
      // Validate required fields
      if (!newCategory.name) {
        toast.error('Category name is required');
        return;
      }

      setLoading(true);
      
      // Prepare category data
      const categoryData = {
        name: newCategory.name,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: newCategory.description || '',
        featured: newCategory.featured || false,
        showInMenu: true,
        isActive: true
      };

      // Add image if provided
      if (newCategory.image) {
        categoryData.image = newCategory.image;
      }
      
      console.log('Creating category with data:', categoryData);
      
      // Make API call to create category
      const response = await categoryService.createCategory(categoryData);
      
      console.log('Create category response:', response);
      
      // Get the created category from the response
      let createdCategory;
      if (response.success && response.data) {
        createdCategory = response.data;
      } else if (response.category) {
        createdCategory = response.category;
      } else {
        createdCategory = response;
      }
      
      // Add to categories array
      setCategories([...categories, createdCategory]);
      
      // Reset form
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        featured: false,
        image: ''
      });
      
      setShowNewCategoryForm(false);
      toast.success('Category created successfully');
      
      // Refresh the categories list
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewSubcategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    const newSubcategoryId = category.subcategories.length > 0 
      ? Math.max(...category.subcategories.map(s => s.id)) + 1 
      : categoryId * 100 + 1;
    
    const newSubcategory = {
      id: newSubcategoryId,
      name: `New Subcategory`,
      slug: `new-subcategory-${newSubcategoryId}`,
      products: 0
    };
    
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? {
            ...c,
            subcategories: [...c.subcategories, newSubcategory]
          }
        : c
    ));
    
    setEditingSubcategory({
      ...newSubcategory,
      categoryId
    });
  };

  const handleToggleFeatured = async (id) => {
    try {
      setLoading(true);
      
      // Find the category to toggle
      const category = categories.find(cat => cat._id === id);
      if (!category) return;
      
      // Make API call to update featured status
      await categoryService.updateCategory(id, {
        featured: !category.featured
      });
      
      // Update local state
      setCategories(categories.map(cat => {
        if (cat._id === id) {
          return { ...cat, featured: !cat.featured };
        }
        return cat;
      }));
      
      toast.success(`Category ${!category.featured ? 'featured' : 'unfeatured'} successfully`);
    } catch (err) {
      console.error('Error toggling featured status:', err);
      toast.error('Failed to update featured status');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-lg shadow-xl flex flex-col items-center">
            <FiLoader size={40} className="text-[#D4AF37] animate-spin mb-4" />
            <p className="text-white text-lg">Processing...</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900 text-white p-4 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">Category Management</h1>
            <p className="text-gray-400 mt-1">Organize your product catalog structure</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setShowNewCategoryForm(true)}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
            >
              Add New Category
            </button>
          </div>
        </div>

        {/* New Category Form */}
        {showNewCategoryForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] rounded-lg shadow-lg p-6 mb-8 border border-gray-800"
          >
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">Create New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. Luxury Gifts"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. luxury-gifts"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Brief description of the category"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image
                </label>
                <input
                  type="text"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g. category-image.jpg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newCategoryFeatured"
                  checked={newCategory.featured}
                  onChange={(e) => setNewCategory({...newCategory, featured: e.target.checked})}
                  className="w-4 h-4 text-[#D4AF37] bg-[#1E1E1E] border-gray-700 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor="newCategoryFeatured" className="ml-2 text-sm text-gray-300">
                  Featured Category
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewCategoryForm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewCategory}
                disabled={!newCategory.name || !newCategory.slug}
                className={`px-4 py-2 rounded-md ${
                  newCategory.name && newCategory.slug
                    ? 'bg-[#D4AF37] text-black hover:bg-[#B8860B]' 
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                Create Category
              </button>
            </div>
          </motion.div>
        )}

        {/* Categories List */}
        {!editingCategory && !editingSubcategory && (
          <div className="space-y-4">
            {categories.map((category) => (
              <motion.div 
                key={category.id}
                variants={itemVariants}
                className="bg-[#121212] rounded-lg shadow-lg overflow-hidden border border-gray-800"
              >
                <div 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 cursor-pointer"
                  onClick={() => handleToggleExpand(category.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg 
                        className={`w-5 h-5 text-[#D4AF37] transform transition-transform ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.products} products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-3 md:mt-0">
                    {category.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37] text-black">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(category.id);
                      }}
                      className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                    >
                      {category.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                      className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {expandedCategories.includes(category.id) && (
                  <div className="border-t border-gray-800 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-medium text-[#D4AF37]">Subcategories</h4>
                      <button
                        onClick={() => handleAddNewSubcategory(category.id)}
                        className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                      >
                        Add Subcategory
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1E1E1E] border-b border-gray-700">
                          <tr>
                            <th className="py-2 px-4 text-left text-xs font-semibold text-[#D4AF37]">Name</th>
                            <th className="py-2 px-4 text-left text-xs font-semibold text-[#D4AF37]">Slug</th>
                            <th className="py-2 px-4 text-left text-xs font-semibold text-[#D4AF37]">Products</th>
                            <th className="py-2 px-4 text-left text-xs font-semibold text-[#D4AF37]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {category.subcategories.map((subcategory) => (
                            <tr key={subcategory.id} className="hover:bg-[#1A1A1A] transition-colors">
                              <td className="py-2 px-4 text-sm text-white">{subcategory.name}</td>
                              <td className="py-2 px-4 text-sm text-gray-300">{subcategory.slug}</td>
                              <td className="py-2 px-4 text-sm text-gray-300">{subcategory.products}</td>
                              <td className="py-2 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditSubcategory(category.id, subcategory)}
                                    className="px-2 py-1 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                    className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors text-xs"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Category Form */}
        {editingCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair font-semibold text-white">Edit Category: {editingCategory.name}</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelEditCategory}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image
                </label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({...editingCategory, image: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editCategoryFeatured"
                  checked={editingCategory.featured}
                  onChange={(e) => setEditingCategory({...editingCategory, featured: e.target.checked})}
                  className="w-4 h-4 text-[#D4AF37] bg-[#1E1E1E] border-gray-700 rounded focus:ring-[#D4AF37] focus:ring-opacity-25"
                />
                <label htmlFor="editCategoryFeatured" className="ml-2 text-sm text-gray-300">
                  Featured Category
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Subcategory Form */}
        {editingSubcategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-playfair font-semibold text-white">Edit Subcategory</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelEditSubcategory}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubcategory}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#B8860B] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={editingSubcategory.name}
                  onChange={(e) => setEditingSubcategory({...editingSubcategory, name: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingSubcategory.slug}
                  onChange={(e) => setEditingSubcategory({...editingSubcategory, slug: e.target.value})}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SuperAdminCategories;
