import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/item.service';
import Loader from '../components/Loader';

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const itemType = searchParams.get('type') || 'lost';
  const isOwner = user && item && user.id === item.userId;

  useEffect(() => {
    let mounted = true;
    
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use the unified item service to get the item by ID and type
        const response = await itemService.getItemById(id, { type: itemType });
        
        if (!mounted) return;
        
        if (response) {
          setItem(response);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchItem();
    }

    return () => { mounted = false; };
  }, [id, itemType]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id, { type: itemType });
        navigate(`/${itemType}-items`);
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Item not found</h3>
          <p className="mt-1 text-sm text-gray-500">The item you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaArrowLeft className="-ml-1 mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = item.date 
    ? format(parseISO(item.date), 'MMMM d, yyyy')
    : 'Date not specified';

  const statusColors = {
    dicari: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    ditemukan: { bg: 'bg-green-100', text: 'text-green-800', label: 'Found' },
    diclaim: { bg: 'blue-100', text: 'text-blue-800', label: 'Claimed' },
    open: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    claimed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Claimed' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
  };

  const status = statusColors[item.status?.toLowerCase()] || statusColors.default;
  const typeColor = itemType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  const typeLabel = itemType === 'lost' ? 'Lost' : 'Found';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to {itemType === 'lost' ? 'Lost' : 'Found'} Items
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.name || 'Untitled Item'}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                    {typeLabel}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              
              {isOwner && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <Link
                    to={`/edit-${itemType}/${item.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Item details */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Image */}
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.name || 'Item image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Item Information</h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex">
                      <FaCalendarAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Date {itemType === 'lost' ? 'Lost' : 'Found'}</p>
                        <p className="text-sm text-gray-900">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <FaMapMarkerAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-sm text-gray-900">{item.location || 'Not specified'}</p>
                      </div>
                    </div>
                    {item.contact && (
                      <div className="flex">
                        <FaPhone className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Contact</p>
                          <p className="text-sm text-gray-900">{item.contact}</p>
                        </div>
                      </div>
                    )}
                    {item.reporter && (
                      <div className="flex">
                        <FaUser className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">
                            {itemType === 'lost' ? 'Reported by' : 'Found by'}
                          </p>
                          <p className="text-sm text-gray-900">{item.reporter}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {item.characteristics && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Characteristics</h2>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {item.characteristics}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}