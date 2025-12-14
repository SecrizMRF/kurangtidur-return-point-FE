// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/item.service';
import { getItemImageUrl } from '../utils/imageHelper';
import Loader from '../components/Loader';
import { FaTrashAlt, FaCheckCircle, FaCircle, FaBoxOpen, FaChartBar } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    page: 1,
    limit: 20
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemService.getItems(filters);
        if (response && response.data) {
          setItems(response.data);
          
          // Calculate stats
          const total = response.data.length;
          const lost = response.data.filter(item => item.type === 'lost').length;
          const found = response.data.filter(item => item.type === 'found').length;
          const claimed = response.data.filter(item => item.status === 'diclaim').length;
          
          setStats({
            totalItems: total,
            lostItems: lost,
            foundItems: found,
            claimedItems: claimed
          });
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await itemService.updateItemStatus(id, newStatus);
      setItems(items.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  const statusColors = {
    dicari: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    ditemukan: { bg: 'bg-green-100', text: 'text-green-800', label: 'Found' },
    diclaim: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Claimed' }
  };

  const typeColor = (type) => type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all lost and found items</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Items"
            value={stats.totalItems}
            icon={<FaBoxOpen className="text-blue-500" />}
          />
          <StatCard
            label="Lost Items"
            value={stats.lostItems}
            icon={<FaCircle className="text-red-500" />}
          />
          <StatCard
            label="Found Items"
            value={stats.foundItems}
            icon={<FaCircle className="text-green-500" />}
          />
          <StatCard
            label="Claimed"
            value={stats.claimedItems}
            icon={<FaCheckCircle className="text-amber-500" />}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="dicari">Searching</option>
                <option value="ditemukan">Found</option>
                <option value="diclaim">Claimed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No items found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reporter</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const imageUrl = getItemImageUrl(item);
                    const status = statusColors[item.status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
                    
                    return (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                              <FaBoxOpen />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor(item.type)}`}>
                            {item.type === 'lost' ? 'Lost' : 'Found'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.location}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.reporter}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.text} border-0 cursor-pointer`}
                          >
                            <option value="dicari">Searching</option>
                            <option value="ditemukan">Found</option>
                            <option value="diclaim">Claimed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <FaTrashAlt className="mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className="text-3xl mr-4">
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
