// src/services/lost.service.js
import api from './api';

const createLostItem = async (formData) => {
  try {
    console.log('DEBUG: createLostItem called with formData');
    
    // IMPORTANT: Don't set Content-Type header, let axios/browser handle it
    // This ensures the boundary is set correctly for multipart/form-data
    const response = await api.post('/items', formData);
    
    console.log('DEBUG: createLostItem response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createLostItem:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

const getLostItems = async () => {
  try {
    const response = await api.get('/items?type=lost');
    return response.data;
  } catch (error) {
    console.error('Error fetching lost items:', error);
    throw error;
  }
};

const getLostItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lost item ${id}:`, error);
    throw error;
  }
};

const updateLostItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lost item ${id}:`, error);
    throw error;
  }
};

const deleteLostItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting lost item ${id}:`, error);
    throw error;
  }
};

export default {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
};