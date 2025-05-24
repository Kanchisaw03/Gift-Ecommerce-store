import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

/**
 * Reusable data table component for dashboards
 * Features sorting, pagination, and action buttons
 */
const DataTable = ({ 
  columns, 
  data, 
  actions = [],
  itemsPerPage = 10,
  searchable = true,
  sortable = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply sorting to data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  // Apply search filter
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Get sort icon
  const getSortIcon = (key) => {
    if (!sortable) return null;
    
    if (sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };
  
  return (
    <div className="w-full">
      {/* Search and filters */}
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-gold/30 text-white focus:outline-none focus:border-gold"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gold/20">
          <thead className="bg-neutral-800 border-b border-gold/20">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider ${sortable ? 'cursor-pointer' : ''}`}
                  onClick={() => handleSort(column.key)}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-gold/10">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <motion.tr 
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 flex space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={`p-1 rounded-full ${action.color || 'text-gold hover:bg-gold/10'}`}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="px-6 py-4 text-center text-sm text-gray-400"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 border-t border-gold/20 pt-4">
          <div 
            className="text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border ${currentPage === 1 ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-gold/30 text-gold hover:bg-gold/10'}`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border ${currentPage === index + 1 ? 'bg-gold/20 border-gold text-gold' : 'border-gold/30 text-gray-300 hover:bg-gold/10'}`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border ${currentPage === totalPages ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-gold/30 text-gold hover:bg-gold/10'}`}
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
