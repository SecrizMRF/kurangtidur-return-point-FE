import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import itemService from '../services/item.service';
import ItemCard from '../components/ItemCard';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

function ListPage() {
  const { type } = useParams(); // 'lost' or 'found'
  console.log('DEBUG: ListPage - URL type from useParams():', type);
  console.log('DEBUG: ListPage - Current URL:', window.location.pathname);
  console.log('DEBUG: ListPage - Is type undefined?', type === undefined);

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
      
      console.log('DEBUG: useEffect - type value is:', type);
      console.log('DEBUG: useEffect - typeof type:', typeof type);
      
      const params = { 
        type: type,  // Explicitly pass type
        status: filters.status,
        search: debouncedSearch
      };
      
      console.log('DEBUG: ListPage calling itemService.getItems with params:', params);
      
      const response = await itemService.getItems(params);
      console.log('API response:', response);
      
      // itemService.getItems returns the full API response object: { success, data: [...], pagination: {...} }
      const itemsArray = response.data || [];
      setItems(Array.isArray(itemsArray) ? itemsArray : []);
    } catch (err) {
      console.error('Error fetching items:', err);
      const errorMessage = err.message || 'Failed to load items. Please check your connection and try again.';
      setError(errorMessage);
      setItems([]); // Ensure items is always an array
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

  const navigate = useNavigate();
  const pageTitle = type === 'lost' ? 'Lost Items' : 'Found Items';
  const pageDescription = type === 'lost' 
    ? 'Browse through lost items reported by others. Help reunite people with their belongings.'
    : 'Browse through found items. Check if something you lost has been found by someone else.';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${type === 'lost' ? 'from-red-50 to-red-100' : 'from-blue-50 to-blue-100'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {pageTitle}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {pageDescription}
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to={`/report/${type}`}
                  className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${type === 'lost' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} md:py-4 md:text-lg md:px-10`}
                >
                  <FaPlus className="mr-2" />
                  Report {type === 'lost' ? 'Lost' : 'Found'} Item
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full max-w-2xl mx-auto">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search items..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 max-w-2xl mx-auto flex gap-4">
            <div className="flex-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="dicari">Searching</option>
                <option value="ditemukan">Found</option>
                <option value="diclaim">Claimed</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {!Array.isArray(items) || items.length === 0 ? (
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-gray-500">
            {filters.search || filters.status !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : `No ${type} items have been reported yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListPage;