// Detail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEdit, FaArrowLeft, FaTrashAlt, FaTag, FaInfoCircle } from 'react-icons/fa'; // Menambahkan FaTrashAlt, FaTag, FaInfoCircle
import { useAuth } from '../context/AuthContext';
import itemService from '../services/item.service';
import Loader from '../components/Loader';
import { getItemImageUrl } from '../utils/imageHelper';

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  
  const itemType = searchParams.get('type') || 'lost';
  // Menggunakan || 'admin' di bawah adalah redundan karena sudah di cek di isOwner
  const isOwner = user && item && (user.id === item.userId || user.role === 'admin');

  useEffect(() => {
    let mounted = true;
    
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use the unified item service to get the item by ID
        const response = await itemService.getItemById(id);
        
        if (!mounted) return;
        
        if (response && response.data) {
          setItem(response.data);
          setImageUrl(getItemImageUrl(response.data));
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
        // Mengubah navigasi agar sesuai dengan rute yang diharapkan (misalnya: /found atau /lost)
        navigate(`/${itemType}`); 
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-stone-50 min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-stone-800 bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    // Styling untuk item not found
    return (
      <div className="max-w-4xl mx-auto p-6 bg-stone-50 min-h-screen">
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-stone-700"
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
          <h3 className="mt-4 text-xl font-medium text-stone-800">Item not found</h3>
          <p className="mt-2 text-md text-gray-500">The item you're looking for doesn't exist or has been removed.</p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-stone-800 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
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
    // Navy & Gold/Yellow Palette
    dicari: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    ditemukan: { bg: 'bg-green-100', text: 'text-green-800', label: 'Found' },
    diclaim: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Claimed' }, // Gold Accent
    open: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    claimed: { bg: 'bg-stone-100', text: 'text-stone-800', label: 'Claimed' }, // Navy/Cream Accent
    default: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
  };

  const status = statusColors[item.status?.toLowerCase()] || statusColors.default;
  // Menggunakan Navy/Stone untuk Lost dan Gold/Amber untuk Found
  const typeColor = itemType === 'lost' ? 'bg-stone-700 text-white' : 'bg-amber-500 text-stone-800';
  const typeLabel = itemType === 'lost' ? 'Lost' : 'Found';

  return (
    // Cream background
    <div className="min-h-screen bg-amber-100 py-10"> 
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-md font-semibold text-stone-700 hover:text-amber-500 transition-colors"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to {itemType === 'lost' ? 'Lost' : 'Found'} Items List
          </button>
        </div>

        {/* Main content - White/Cream card with elegant shadow */}
        <div className="bg-stone-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* Judul dengan Navy/Stone 800 */}
                <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">{item.name || 'Untitled Item'}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {/* Type Badge - Navy/Gold Colors */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${typeColor}`}>
                    <FaTag className="w-3 h-3 mr-1" />
                    {typeLabel}
                  </span>
                  {/* Status Badge - Gold/Cream Colors */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status.bg} ${status.text} border border-opacity-50`}>
                    <FaInfoCircle className="w-3 h-3 mr-1" />
                    {status.label}
                  </span>
                </div>
              </div>
              
              {isOwner && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  {/* Edit Button - Gold */}
                  <Link
                    to={`/edit-${itemType}/${item.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-stone-800 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors transform hover:scale-[1.05]"
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  {/* Delete Button - Navy/Red for caution */}
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors transform hover:scale-[1.05]"
                  >
                    <FaTrashAlt className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Item details */}
          <div className="px-6 py-8 sm:p-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3"> {/* Mengubah layout menjadi 3 kolom */}
              
              {/* Image Column */}
              <div className="lg:col-span-1">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name || 'Item image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error for URL:', imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                      <svg className="h-28 w-28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Details & Description Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Item Information */}
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-4 border-b-2 border-amber-500 pb-1 inline-block">Key Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    {/* Date */}
                    <div className="flex items-start">
                      <FaCalendarAlt className="flex-shrink-0 h-6 w-6 text-amber-500 mt-0.5" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Date {itemType === 'lost' ? 'Lost' : 'Found'}</p>
                        <p className="text-md font-semibold text-stone-700">{formattedDate}</p>
                      </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="flex-shrink-0 h-6 w-6 text-stone-700 mt-0.5" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-md font-semibold text-stone-700">{item.location || 'Not specified'}</p>
                      </div>
                    </div>
                    {/* Contact */}
                    {item.contact && (
                      <div className="flex items-start">
                        <FaPhone className="flex-shrink-0 h-6 w-6 text-amber-500 mt-0.5" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Contact</p>
                          <p className="text-md font-semibold text-stone-700">{item.contact}</p>
                        </div>
                      </div>
                    )}
                    {/* Reporter */}
                    {item.reporter && (
                      <div className="flex items-start">
                        <FaUser className="flex-shrink-0 h-6 w-6 text-stone-700 mt-0.5" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">
                            {itemType === 'lost' ? 'Reported by' : 'Found by'}
                          </p>
                          <p className="text-md font-semibold text-stone-700">{item.reporter}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-4 border-b-2 border-stone-700 pb-1 inline-block">Description</h2>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-md text-gray-700 whitespace-pre-line">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Characteristics */}
                {item.characteristics && (
                  <div>
                    <h2 className="text-xl font-bold text-stone-800 mb-4 border-b-2 border-stone-700 pb-1 inline-block">Characteristics / Unique Marks</h2>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-md text-gray-700 whitespace-pre-line">
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