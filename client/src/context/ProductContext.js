import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const ProductContext = createContext();

// Product action types
const PRODUCT_ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCT: 'SET_PRODUCT',
  SET_MY_PRODUCTS: 'SET_MY_PRODUCTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Initial state
const initialState = {
  products: [],
  product: null,
  myProducts: [],
  categories: [],
  pagination: null,
  filters: {
    search: '',
    category: 'all',
    condition: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  },
  loading: false,
  error: null
};

// Product reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case PRODUCT_ACTIONS.SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
        loading: false,
        error: null
      };
    case PRODUCT_ACTIONS.SET_MY_PRODUCTS:
      return {
        ...state,
        myProducts: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null
      };
    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case PRODUCT_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };
    default:
      return state;
  }
};

// Product Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products with filters
  const fetchProducts = async (page = 1, customFilters = {}) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const filters = { ...state.filters, ...customFilters };
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.condition !== 'all' && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.sortBy && { sortBy: filters.sortBy })
      });

      const response = await api.get(`/products?${queryParams}`);
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS,
        payload: {
          products: response.data.data,
          pagination: response.data.pagination
        }
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch products'
      });
    }
  };

  // Fetch single product
  const fetchProduct = async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get(`/products/${productId}`);
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCT,
        payload: response.data.data.product
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch product'
      });
    }
  };

  // Fetch user's products
  const fetchMyProducts = async (page = 1) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get(`/products/user/my-products?page=${page}&limit=12`);
      dispatch({
        type: PRODUCT_ACTIONS.SET_MY_PRODUCTS,
        payload: {
          products: response.data.data,
          pagination: response.data.pagination
        }
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch your products'
      });
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      dispatch({
        type: PRODUCT_ACTIONS.SET_CATEGORIES,
        payload: response.data.data.categories
      });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
      return { success: true, product: response.data.data.product };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.put(`/products/${productId}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
      return { success: true, product: response.data.data.product };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      await api.delete(`/products/${productId}`);
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Toggle like product
  const toggleLike = async (productId) => {
    try {
      const response = await api.post(`/products/${productId}/like`);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle like';
      return { success: false, error: errorMessage };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_FILTERS });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchProducts,
    fetchProduct,
    fetchMyProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleLike,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;