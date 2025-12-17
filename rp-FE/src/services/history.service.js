// src/services/history.service.js
import api from './api';

const historyService = {
  /**
   * Get history for a specific item
   * @param {number} itemId - Item ID
   * @param {number} limit - Records per page
   * @param {number} offset - Pagination offset
   */
  async getItemHistory(itemId, limit = 20, offset = 0) {
    try {
      console.log(`📖 Fetching history for item ${itemId}`);
      const response = await api.get(`/items/${itemId}/history`, {
        params: { limit, offset }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching item history:', error);
      throw error.response?.data || { message: 'Failed to fetch history' };
    }
  },

  /**
   * Get all history (admin only)
   * @param {object} filters - Filter options {action, changedBy}
   * @param {number} limit - Records per page
   * @param {number} offset - Pagination offset
   */
  async getAllHistory(filters = {}, limit = 50, offset = 0) {
    try {
      console.log('📖 Fetching all history');
      const response = await api.get('/items/admin/history/all', {
        params: { ...filters, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all history:', error);
      throw error.response?.data || { message: 'Failed to fetch history' };
    }
  },

  /**
   * Format history action for display
   */
  formatAction(action) {
    const actions = {
      created: '🆕 Created',
      updated: '✏️ Updated',
      status_changed: '🔄 Status Changed',
      deleted: '🗑️ Deleted'
    };
    return actions[action] || action;
  },

  /**
   * Format changed fields for display
   */
  formatChanges(oldData, newData) {
    if (!oldData || !newData) return null;

    const changes = [];
    const allKeys = new Set([
      ...Object.keys(oldData || {}),
      ...Object.keys(newData || {})
    ]);

    allKeys.forEach(key => {
      if (oldData[key] !== newData[key]) {
        changes.push({
          field: key,
          old: oldData[key],
          new: newData[key]
        });
      }
    });

    return changes;
  }
};

export default historyService;
