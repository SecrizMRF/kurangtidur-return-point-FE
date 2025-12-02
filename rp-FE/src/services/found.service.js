// src/services/found.service.js
import api from './api';

const createFoundItem = async (formData) => {
  try {
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in createFoundItem:', error);
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