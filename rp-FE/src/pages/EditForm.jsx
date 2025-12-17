// EditForm.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTrashAlt } from 'react-icons/fa'; // Added FaTrashAlt (for consistency, though not used here)
import { useAuth } from '../context/AuthContext';
import itemService from '../services/item.service';
import Loader from '../components/Loader';

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    item_type: 'lost',
    location: '',
    date: '',
    contact_info: '',
    photo: null
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await itemService.getItemById(id);
        
        if (response && response.data) {
          const itemData = response.data;
          setItem(itemData);
          
          // Pre-fill form with existing data
          setFormData({
            title: itemData.name || itemData.title || '',
            description: itemData.description || '',
            item_type: itemData.type || 'lost',
            location: itemData.location || '',
            // Ensure date is in YYYY-MM-DD format for input type="date"
            date: itemData.date ? new Date(itemData.date).toISOString().split('T')[0] : '',
            contact_info: itemData.contact || '',
            photo: null
          });
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Form input changed:', { name, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Current formData state:', formData);
    
    try {
      setLoading(true);
      
      // Data preparation (if photo is to be handled, use FormData. Currently sends JSON)
      const jsonData = {
        title: formData.title,
        description: formData.description,
        item_type: formData.item_type,
        location: formData.location,
        date: formData.date,
        contact_info: formData.contact_info
      };
      
      console.log('JSON data being sent:', jsonData);

      // Assuming itemService.updateItem handles sending the correct payload type
      const response = await itemService.updateItem(id, jsonData);
      
      // Navigate back to item details
      navigate(`/detail/${id}?type=${formData.item_type}`);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  
  if (error) {
    // Error styling with Cream/Navy/Gold palette
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

  const itemType = formData.item_type;
  const pageTitle = itemType === 'lost' ? 'Edit Lost Item' : 'Edit Found Item';
  // Mapping custom colors
  const mainColorClass = itemType === 'lost' ? 'bg-stone-700 hover:bg-stone-800 focus:ring-stone-500' : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500';
  const headerBgClass = itemType === 'lost' ? 'bg-stone-100 border-stone-200' : 'bg-amber-100 border-amber-200';
  const headerTextColor = 'text-stone-800';

  return (
    // Cream background
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button - Navy text, Gold hover */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-md font-semibold text-stone-700 hover:text-amber-500 transition-colors"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Item Details
          </button>
        </div>

        {/* Main Card - White/Cream, Elegant Shadow */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section - Accented by item type */}
          <div className={`${headerBgClass} px-6 py-6 sm:px-8 border-b border-gray-200`}>
            <h1 className={`text-3xl font-extrabold ${headerTextColor}`}>{pageTitle}</h1>
            <p className="mt-1 text-md text-gray-600">
              Update the information for this item
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-stone-700 mb-1">
                    Item Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    // Modern input styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Item Type */}
                <div>
                  <label htmlFor="item_type" className="block text-sm font-semibold text-stone-700 mb-1">
                    Item Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="item_type"
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleInputChange}
                    required
                    // Modern select styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white transition-colors"
                  >
                    <option value="lost">Lost Item (Navy - Stone)</option>
                    <option value="found">Found Item (Gold - Amber)</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-stone-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Where was the item lost/found?"
                    // Modern input styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-stone-700 mb-1">
                    Date {itemType === 'lost' ? 'Lost' : 'Found'}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    // Modern date input styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Contact Info */}
                <div>
                  <label htmlFor="contact_info" className="block text-sm font-semibold text-stone-700 mb-1">
                    Contact Information <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_info"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone number or email"
                    // Modern input styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide a detailed description of the item..."
                    // Modern textarea styling
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label htmlFor="photo" className="block text-sm font-semibold text-stone-700 mb-1">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    // Modern file input styling
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-700 file:text-white hover:file:bg-stone-800 transition-colors"
                  />
                  {item && item.photo && (
                    <p className="mt-2 text-sm text-gray-500 italic">
                      Current photo URL available. Uploading a new file will replace it.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-4">
                {/* Cancel Button - Cream/Navy style */}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-stone-300 hover:bg-stone-400 text-stone-800 font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-md"
                >
                  Cancel
                </button>
                {/* Save Button - Gold/Navy color based on itemType */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-6 py-2.5 border border-transparent text-md font-semibold rounded-lg shadow-lg text-white ${mainColorClass} disabled:opacity-50 transition-colors`}
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}