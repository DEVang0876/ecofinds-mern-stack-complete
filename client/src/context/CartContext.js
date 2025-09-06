import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false,
        error: null
      };
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        error: null
      };
    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated, user]);

  // Fetch cart function
  const fetchCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get('/cart');
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: response.data.data.cart
      });
    } catch (error) {
      console.error('Fetch cart error:', error);
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch cart'
      });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await api.post('/cart/add', { productId, quantity });
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: response.data.data.cart
      });
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data || { message: 'Failed to add item to cart' };
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorData.message });
      return { success: false, error: errorData };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await api.put('/cart/update', { productId, quantity });
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: response.data.data.cart
      });
      return { success: true };
    } catch (error) {
  const errorData = error.response?.data || { message: 'Failed to update cart item' };
  dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorData.message });
  return { success: false, error: errorData };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await api.delete(`/cart/remove/${productId}`);
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: response.data.data.cart
      });
      return { success: true };
    } catch (error) {
  const errorData = error.response?.data || { message: 'Failed to remove item from cart' };
  dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorData.message });
  return { success: false, error: errorData };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await api.delete('/cart/clear');
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;