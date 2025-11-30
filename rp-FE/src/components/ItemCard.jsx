// src/components/ItemCard.jsx
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { FaMapMarkerAlt, FaClock, FaEye } from 'react-icons/fa';

function ItemCard({ item }) {
  const itemType = item.type || 'lost';
  const statusColors = {
    dicari: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    ditemukan: { bg: 'bg-green-100', text: 'text-green-800', label: 'Found' },
    diclaim: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Claimed' },
    open: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Searching' },
    claimed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Claimed' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
  };

  const status = statusColors[item.status?.toLowerCase()] || statusColors.default;
  const typeColor = itemType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  const typeLabel = itemType === 'lost' ? 'Lost' : 'Found';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title || 'Item image'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Item Type Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Status */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.title || 'Untitled Item'}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Location and Date */}
        <div className="space-y-1.5 mt-2">
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">{item.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
            <span>{format(new Date(item.date || item.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-2 flex-1">
          {item.description || 'No description provided.'}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <FaEye className="mr-1.5 h-4 w-4" />
            <span>Details</span>
          </div>
          <Link
            to={`/detail/${item.id}?type=${itemType}`}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
              itemType === 'lost' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              itemType === 'lost' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;