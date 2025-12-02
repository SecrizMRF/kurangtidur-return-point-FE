// src/services/found.service.js
import api from './api';

const createFoundItem = async (formData) => {
  try {
    console.log('DEBUG: createFoundItem called with formData');
    
    // IMPORTANT: Don't set Content-Type header, let axios/browser handle it
    // This ensures the boundary is set correctly for multipart/form-data
    const response = await api.post('/items', formData);
    
    console.log('DEBUG: createFoundItem response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createFoundItem:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

const getFoundItems = async () => {
  try {
    const response = await api.get('/items?type=found');
    return response.data;
  } catch (error) {
    console.error('Error fetching found items:', error);
    throw error;
  }
};

const getFoundItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching found item ${id}:`, error);
    throw error;
  }
};

const updateFoundItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating found item ${id}:`, error);
    throw error;
  }
};

const deleteFoundItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting found item ${id}:`, error);
    throw error;
  }
};

export default {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
};