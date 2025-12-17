// src/components/AllHistory.jsx
import React, { useEffect, useState } from 'react';
import historyService from '../services/history.service';
import Loader from './Loader';
import { FaClock, FaUser, FaFilter } from 'react-icons/fa';

export default function AllHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    changedBy: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0
  });

  useEffect(() => {
    fetchAllHistory();
  }, [filters, pagination.page]);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const offset = (pagination.page - 1) * pagination.limit;
      const response = await historyService.getAllHistory(
        filters,
        pagination.limit,
        offset
      );
      setHistory(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'bg-green-50 border-l-4 border-green-400';
      case 'updated':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'status_changed':
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      case 'deleted':
        return 'bg-red-50 border-l-4 border-red-400';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400';
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter size={16} />
          <h3 className="font-semibold text-stone-700">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Action Type
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="created">🆕 Created</option>
              <option value="updated">✏️ Updated</option>
              <option value="status_changed">🔄 Status Changed</option>
              <option value="deleted">🗑️ Deleted</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Changed By
            </label>
            <input
              type="text"
              value={filters.changedBy}
              onChange={(e) => handleFilterChange('changedBy', e.target.value)}
              placeholder="Username..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No history records found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {history.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${getActionColor(record.action)}`}
              >
                {/* Header */}
                <div
                  className="flex justify-between items-start"
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-stone-700">
                        {historyService.formatAction(record.action)}
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        Item #{record.item_id}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <FaUser size={12} />
                        <span>{record.changed_by}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock size={12} />
                        <span>{formatDate(record.changed_at)}</span>
                      </div>
                    </div>

                    {record.description && (
                      <p className="text-sm text-stone-700 mt-2 font-medium">
                        {record.description}
                      </p>
                    )}
                  </div>

                  <span className="ml-4 text-gray-400">
                    {expandedId === record.id ? '▼' : '▶'}
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedId === record.id && (
                  <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
                    {record.action === 'created' && record.new_data && (
                      <div>
                        <h4 className="font-semibold text-stone-700 mb-2">Initial Data:</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(record.new_data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="font-medium text-stone-700">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value || '-')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(record.action === 'updated' || record.action === 'status_changed') &&
                      record.old_data &&
                      record.new_data && (
                        <div>
                          <h4 className="font-semibold text-stone-700 mb-2">Changes:</h4>
                          <div className="space-y-2 text-sm">
                            {Object.entries(record.old_data).map(([key, oldValue]) => {
                              const newValue = record.new_data[key];
                              if (oldValue !== newValue) {
                                return (
                                  <div key={key} className="flex gap-2 bg-white rounded p-2">
                                    <div className="flex-1">
                                      <p className="capitalize font-medium text-gray-700">{key}:</p>
                                      <div className="flex gap-2 mt-1">
                                        <div className="flex-1">
                                          <p className="text-xs text-gray-500 mb-1">Before:</p>
                                          <p className="bg-red-100 text-red-800 p-1 rounded text-xs truncate">
                                            {typeof oldValue === 'object'
                                              ? JSON.stringify(oldValue)
                                              : String(oldValue || '(empty)')}
                                          </p>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-xs text-gray-500 mb-1">After:</p>
                                          <p className="bg-green-100 text-green-800 p-1 rounded text-xs truncate">
                                            {typeof newValue === 'object'
                                              ? JSON.stringify(newValue)
                                              : String(newValue || '(empty)')}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )}

                    {record.action === 'deleted' && record.old_data && (
                      <div>
                        <h4 className="font-semibold text-stone-700 mb-2">Deleted Data:</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(record.old_data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="font-medium text-stone-700 line-through">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value || '-')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <button
                onClick={() =>
                  setPagination(prev => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1)
                  }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-2 bg-stone-700 text-white rounded disabled:bg-gray-400"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {totalPages} ({pagination.total} records)
              </span>

              <button
                onClick={() =>
                  setPagination(prev => ({
                    ...prev,
                    page: Math.min(totalPages, prev.page + 1)
                  }))
                }
                disabled={pagination.page === totalPages}
                className="px-3 py-2 bg-stone-700 text-white rounded disabled:bg-gray-400"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
