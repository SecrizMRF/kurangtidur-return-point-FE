// src/components/ItemHistory.jsx
import React, { useEffect, useState } from 'react';
import historyService from '../services/history.service';
import Loader from './Loader';
import { FaClock, FaUser } from 'react-icons/fa';

export default function ItemHistory({ itemId, showDetails = true }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [itemId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await historyService.getItemHistory(itemId, 50);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
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

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No history available for this item</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-stone-700 mb-4">📋 Activity History</h3>

      {history.map((record) => (
        <div key={record.id} className={`p-4 rounded-lg cursor-pointer transition-all ${getActionColor(record.action)}`}>
          {/* Header Row */}
          <div 
            className="flex justify-between items-start"
            onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-stone-700">
                  {historyService.formatAction(record.action)}
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
          {expandedId === record.id && showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
              {/* Action: Created */}
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

              {/* Action: Updated or Status Changed */}
              {(record.action === 'updated' || record.action === 'status_changed') && record.old_data && record.new_data && (
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
                                  <p className="bg-red-100 text-red-800 p-1 rounded text-xs">
                                    {typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || '(empty)')}
                                  </p>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">After:</p>
                                  <p className="bg-green-100 text-green-800 p-1 rounded text-xs">
                                    {typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || '(empty)')}
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

              {/* Action: Deleted */}
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
  );
}
