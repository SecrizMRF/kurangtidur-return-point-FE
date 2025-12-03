// ListPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import itemService from '../services/item.service';
import ItemCard from '../components/ItemCard';
import { FaSearch, FaFilter, FaPlus, FaSort, FaExclamationCircle } from 'react-icons/fa'; // Added FaExclamationCircle

function ListPage() {
  const location = window.location.pathname;
  const typeFromPath = location.includes('/found') ? 'found' : location.includes('/lost') ? 'lost' : 'all';
  const { type: typeFromParams } = useParams();
  
  const type = typeFromParams || typeFromPath;
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: 'newest'
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = { 
        type: type, // Explicitly pass type
        status: filters.status,
        search: debouncedSearch
      };
      
      const response = await itemService.getItems(params);
      
      let itemsArray = [];
      if (response && response.data) {
        // Ensure that the 'type' property is set for ItemCard consistency
        itemsArray = Array.isArray(response.data) 
          ? response.data.map(item => ({ ...item, type: item.type || type })) 
          : [];
      }
      
      setItems(itemsArray);
    } catch (err) {
      console.error('Error fetching items:', err);
      const errorMessage = err.message || 'Failed to load items. Please check your connection and try again.';
      setError(errorMessage);
      setItems([]); 
    } finally {
      setLoading(false);
    }
  };

  fetchItems();
}, [type, filters.status, debouncedSearch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const pageTitle = type === 'lost' ? 'Lost Items Registry' : 'Found Items Repository';
  const pageDescription = type === 'lost' 
    ? 'Browse through items reported as lost by the community. Find your belongings here.'
    : 'Check the collection of reported found items. Help us match items with their owners.';

  // 🎯 Ganti stone-700/800 menjadi slate-900 (Navy)
  const primaryNavy = 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500';
  const primaryGold = 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-slate-900';
  
  // Custom colors based on type, using Navy and Gold for a premium feel
  const accentColor = type === 'lost' ? 'text-red-500' : 'text-amber-500'; // Red for lost urgency
  const buttonClass = type === 'lost' ? primaryNavy : primaryGold; // Navy button for Lost, Gold button for Found
  const focusRingClass = 'focus:border-amber-500 focus:ring-amber-500'; // Consistent Gold focus ring

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-slate-900 min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-md mt-10">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Error loading data: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 1. 🎯 Container Utama: Menggunakan Navy Background
    <div className="min-h-screen bg-slate-900"> 
      
      {/* 2. Hero Section - White Card menonjol di atas Navy */}
      <div className={`py-16`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center">
            
            {/* Title - Navy text with Gold accent */}
            <h1 className={`text-6xl font-extrabold text-slate-900 sm:tracking-tight lg:text-7xl`}>
              <span className={accentColor}>{type === 'lost' ? 'LOST' : 'FOUND'}</span> Items
            </h1>
            <p className="mt-4 max-w-lg mx-auto text-lg text-gray-700 md:mt-6 md:text-xl">
              {pageDescription}
            </p>
            
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
              <div className="rounded-xl shadow-xl">
                {/* Report Button - Navy or Gold */}
                <Link
                  to={`/report/${type}`}
                  className={`w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-xl text-white ${buttonClass} md:py-5 md:text-xl md:px-12 transition-all transform hover:scale-[1.02] ${type !== 'lost' ? 'text-slate-900' : 'text-white'}`}
                >
                  <FaPlus className="mr-3 h-5 w-5" />
                  Report {type === 'lost' ? 'Lost' : 'Found'} Item
                </Link>
              </div>
            </div>
          </div>
          
          {/* 3. Filters Section - Di dalam Hero Card (White) */}
          <div className="mt-12 w-full max-w-4xl mx-auto space-y-4">
            
            {/* Search Input - Tetap putih bersih */}
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title, description, or location..."
                className={`w-full rounded-xl border-gray-300 shadow-lg py-4 px-6 pl-14 text-lg ${focusRingClass}`}
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Status and Sort Filters */}
            <div className="max-w-4xl mx-auto flex gap-6">
              <div className="flex-1">
                <label htmlFor="status" className="block text-sm font-semibold text-slate-800 mb-1">
                  <FaFilter className="inline mr-2 h-4 w-4 text-amber-500" /> Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={`w-full rounded-xl border-gray-300 shadow-md py-4 px-6 text-md ${focusRingClass} transition-colors`}
                >
                  <option value="all">All Status</option>
                  <option value="dicari">Searching</option>
                  <option value="ditemukan">Found</option>
                  <option value="diclaim">Claimed</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="sort" className="block text-sm font-semibold text-slate-800 mb-1">
                  <FaSort className="inline mr-2 h-4 w-4 text-amber-500" /> Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className={`w-full rounded-xl border-gray-300 shadow-md py-4 px-6 text-md ${focusRingClass} transition-colors`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Items Grid Section - Kontras di atas Navy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subtitle di atas Grid - White/Gold */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Latest {type === 'lost' ? 'Lost' : 'Found'} Reports
        </h2>

        {!Array.isArray(items) || items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <svg
              className="mx-auto h-20 w-20 text-slate-900"
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
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">No items found</h3>
            <p className="mt-2 text-md text-gray-600">
              {filters.search || filters.status !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : `No ${type} items have been reported yet. Be the first to report!`}
            </p>
            <div className="mt-8">
              <Link
                to={`/report/${type}`}
                className={`inline-flex items-center px-8 py-3 border border-transparent shadow-lg text-lg font-semibold rounded-xl text-white ${buttonClass} transition-colors ${type !== 'lost' ? 'text-slate-900' : 'text-white'}`}
              >
                <FaPlus className="-ml-1 mr-3 h-5 w-5" />
                Report New Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListPage;