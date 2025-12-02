import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
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
    console.log('Title value:', formData.title);
    console.log('Title length:', formData.title?.length);
    console.log('Title type:', typeof formData.title);
    
    try {
      setLoading(true);
      
      // Temporarily send as JSON to test
      const jsonData = {
        title: formData.title,
        description: formData.description,
        item_type: formData.item_type,
        location: formData.location,
        date: formData.date,
        contact_info: formData.contact_info
      };
      
      console.log('JSON data being sent:', jsonData);

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

  const itemType = formData.item_type;
  const pageTitle = itemType === 'lost' ? 'Edit Lost Item' : 'Edit Found Item';
  const pageColor = itemType === 'lost' ? 'red' : 'blue';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Item Details
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className={`bg-${pageColor}-50 px-4 py-5 sm:px-6 border-b border-${pageColor}-200`}>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update the information for this item
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Item Type */}
                <div>
                  <label htmlFor="item_type" className="block text-sm font-medium text-gray-700">
                    Item Type *
                  </label>
                  <select
                    id="item_type"
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Where was the item lost/found?"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date {itemType === 'lost' ? 'Lost' : 'Found'}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                    Contact Information *
                  </label>
                  <input
                    type="text"
                    id="contact_info"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone number or email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide a detailed description of the item..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {item && item.photo && (
                    <p className="mt-2 text-sm text-gray-500">
                      Current photo: {item.photo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${pageColor}-600 hover:bg-${pageColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${pageColor}-500 disabled:opacity-50`}
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
