// src/services/item.service.js
import api from './api';

const itemService = {
  // Get all items with optional filters
  async getItems(filters = {}) {
    try {
      // Extract with careful handling of undefined values
      let { type, status, page, limit, search } = filters;
      
      // Set defaults only if undefined - NEVER use default in destructuring when checking undefined
      type = type !== undefined && type !== null ? type : 'all';
      status = status !== undefined && status !== null ? status : 'all';
      page = page !== undefined && page !== null ? page : 1;
      limit = limit !== undefined && limit !== null ? limit : 10;
      search = search !== undefined && search !== null ? search : '';
      
      console.log('DEBUG: item.service.getItems() received filters:', filters);
      console.log('DEBUG: item.service.getItems() after defaults - type:', type, 'status:', status);
      
      // Only include non-empty parameters that backend supports
      const params = { type, page, limit };
      if (status && status !== 'all') params.status = status;
      if (search && search.trim()) params.search = search.trim();
      
      console.log('Service calling API with final params:', params);
      
      const response = await api.get('/items', {
        params: params
      });
      
      console.log('Service received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service error:', error);
      console.error('Error response data:', error.response?.data);
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
      // If itemData is FormData or has a File object, send as multipart
      if (itemData instanceof FormData || (itemData.photo && itemData.photo instanceof File)) {
        const formData = new FormData();
        Object.entries(itemData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
        
        const response = await api.put(`/items/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Send as JSON for text-only updates
        const response = await api.put(`/items/${id}`, itemData);
        return response.data;
      }
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