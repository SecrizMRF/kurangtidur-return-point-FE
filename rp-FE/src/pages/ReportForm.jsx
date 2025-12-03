// ReportForm.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import lostService from '../services/lost.service';
import foundService from '../services/found.service';

export default function ReportForm() {
  const { type } = useParams();
  console.log('Current URL type:', type);
  console.log('Current URL:', window.location.pathname);
  
  const [form, setForm] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    photo: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, photo: file }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  /**
   * Handles form submission, selects the correct service (lost/found),
   * constructs FormData, and sends the request.
   */
  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.location || !form.contact) {
      return setError('Nama, lokasi, dan kontak wajib diisi');
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', form.name);
      fd.append('location', form.location);
      
      // Use the provided date or default to the current time, formatted as ISO string
      const reportDate = form.date 
        ? new Date(form.date).toISOString() 
        : new Date().toISOString();
        
      fd.append('date', reportDate);
      
      fd.append('description', form.description || 'No description provided');
      fd.append('contact_info', form.contact); // Contact is required per validation above
      fd.append('item_type', type || 'lost'); // 'lost' or 'found'
      
      if (form.photo) {
        fd.append('photo', form.photo);
      }

      // Debug: log FormData contents
      console.log('FormData contents:');
      console.log('Type parameter:', type);
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      // 🎯 Simplified Service Call Logic 🎯
      const serviceToUse = type === 'found' ? foundService : lostService;
      const serviceMethod = type === 'found' ? 'createFoundItem' : 'createLostItem';
      
      // Call the selected method on the selected service with FormData
      await serviceToUse[serviceMethod](fd);
      
      navigate(`/${type}`); // Redirect to /lost or /found
    } catch (err) {
      console.error('Error submitting form:', err);
      // Ensure error handling is robust
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Report {type === 'found' ? 'Found' : 'Lost'} Item
      </h1>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">Item Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Contact</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-amber-600 file:text-white
                      hover:file:bg-amber-800"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}