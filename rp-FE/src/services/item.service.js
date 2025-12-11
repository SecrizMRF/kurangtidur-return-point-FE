import api from './api';

const itemService = {
  async getItems(params = {}) {
    try {
      const response = await api.get('/items', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch items' };
    }
  },

  async getItemById(id) {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch item' };
    }
  },

  async createItem(payload) {
    try {
      const headers = payload instanceof FormData ? 
        { 'Content-Type': 'multipart/form-data' } : 
        { 'Content-Type': 'application/json' };

      const response = await api.post('/items', payload, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create item' };
    }
  },

  async updateItem(id, payload) {
    try {
      const headers = payload instanceof FormData ? 
        { 'Content-Type': 'multipart/form-data' } : 
        { 'Content-Type': 'application/json' };

      const response = await api.put(`/items/${id}`, payload, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update item' };
    }
  },

  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete item' };
    }
  }
};

export default itemService;