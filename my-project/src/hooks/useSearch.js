import { useState, useEffect, useCallback, useRef } from 'react';
import { searchProducts, getSearchSuggestions } from '../services/api/searchService';
import { debounce } from '../utils/helpers';

/**
 * Custom hook for handling product search functionality
 * @param {Object} options - Hook options
 * @param {number} options.debounceTime - Debounce time in milliseconds
 * @param {number} options.minQueryLength - Minimum query length to trigger search
 * @returns {Object} - Search state and functions
 */
const useSearch = ({
  debounceTime = 300,
  minQueryLength = 2
} = {}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  /**
   * Perform product search
   * @param {string} searchQuery - Search query
   * @param {Object} params - Additional search parameters
   */
  const performSearch = useCallback(async (searchQuery, params = {}) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchProducts(searchQuery, params);
      setResults(response.data || response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [minQueryLength]);

  /**
   * Fetch search suggestions
   * @param {string} searchQuery - Search query
   */
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await getSearchSuggestions(searchQuery);
      setSuggestions(response.data || response || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    }
  }, [minQueryLength]);

  // Create debounced versions of search functions
  const debouncedSearch = useCallback(
    debounce((searchQuery, params) => {
      performSearch(searchQuery, params);
    }, debounceTime),
    [performSearch, debounceTime]
  );

  const debouncedSuggestions = useCallback(
    debounce((searchQuery) => {
      fetchSuggestions(searchQuery);
    }, debounceTime / 2), // Faster debounce for suggestions
    [fetchSuggestions, debounceTime]
  );

  /**
   * Handle search input change
   * @param {Event} event - Input change event
   */
  const handleSearchChange = useCallback((event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    
    if (searchQuery.length >= minQueryLength) {
      debouncedSuggestions(searchQuery);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [minQueryLength, debouncedSuggestions]);

  /**
   * Handle search submission
   * @param {Event} event - Form submission event
   */
  const handleSearchSubmit = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
    
    setShowSuggestions(false);
    performSearch(query);
  }, [query, performSearch]);

  /**
   * Select a suggestion
   * @param {string} suggestion - Selected suggestion
   */
  const selectSuggestion = useCallback((suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  }, [performSearch]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Focus search input if available
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    query,
    results,
    suggestions,
    loading,
    error,
    showSuggestions,
    searchInputRef,
    handleSearchChange,
    handleSearchSubmit,
    selectSuggestion,
    clearSearch,
    performSearch
  };
};

export default useSearch;
