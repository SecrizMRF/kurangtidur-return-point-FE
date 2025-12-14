// src/services/admin.service.js
import api from './api';

const adminService = {
  // Get all items (admin view with all details)
  async getAllItems(filters = {}) {
    try {
      const { type, status, page, limit, search } = filters;
      
      const params = {};
      if (type && type !== 'all') params.type = type;
      if (status && status !== 'all') params.status = status;
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (search) params.search = search;
      
      const response = await api.get('/items', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw error.response?.data || { message: 'Failed to fetch items' };
    }
  },

  // Get statistics
  async getStats() {
    try {
      const response = await api.get('/items/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return default stats if endpoint doesn't exist
      return {
        success: true,
        data: {
          totalItems: 0,
          lostItems: 0,
          foundItems: 0,
          claimedItems: 0
        }
      };
    }
  },

  // Update item status (admin action)
  async updateItemStatus(id, status) {
    try {
      const response = await api.put(`/items/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating item ${id} status:`, error);
      throw error.response?.data || { message: 'Failed to update item status' };
    }
  },

  // Delete item (admin action)
  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item ${id}:`, error);
      throw error.response?.data || { message: 'Failed to delete item' };
    }
  }
};

export default adminService;
