// src/services/item.service.js
import api from './api';

const itemService = {
  // Get all items with optional filters
  async getItems(filters = {}) {
    try {
      const { type = 'all', status = 'all', page = 1, limit = 10, search = '' } = filters;
      
      // Only include non-empty parameters that backend supports
      const params = { type, page, limit };
      if (status && status !== 'all') params.status = status;
      if (search && search.trim()) params.search = search.trim();
      
      console.log('Service calling API with params:', params);
      
      const response = await api.get('/items', {
        params: params
      });
      
      console.log('Service received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error);
      throw error.response?.data || { message: 'Failed to fetch items' };
    }
  },

  // Get single item by ID
  async getItemById(id) {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch item' };
    }
  },

  // Create a new item
  async createItem(itemData) {
    try {
      const formData = new FormData();
      Object.entries(itemData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      const response = await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create item' };
    }
  },

  // Update item status
  async updateItemStatus(id, status) {
    try {
      const response = await api.put(`/items/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update item status' };
    }
  },

  // Update an item
  async updateItem(id, itemData) {
    try {
      // Temporarily send as JSON to test
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update item' };
    }
  },

  // Delete an item
  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete item' };
    }
  },

  // Get current user's items
  async getMyItems(filters = {}) {
    try {
      const { type = 'all', status } = filters;
      const response = await api.get('/items/me/items', {
        params: { type, status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your items' };
    }
  }
};

export default itemService;