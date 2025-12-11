import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaClock, FaArrowRight, FaTag } from 'react-icons/fa';
import '../styles/ItemCard.css';

function ItemCard({ item }) {
  const itemType = item.type || 'lost';
  const statusClass = item.status ? item.status.toLowerCase() : 'default';
  
  const typeLabel = itemType === 'lost' ? 'Kehilangan' : 'Penemuan';

  return (
    <div className="card-wrapper">
      <div className="card-image-container">
        {item.image_url || item.photo ? (
          <img 
            src={item.image_url || item.photo} 
            alt={item.name} 
            className="card-image" 
          />
        ) : (
          <div className="card-placeholder">
            <FaTag className="placeholder-icon" />
          </div>
        )}
        
        <div className="card-badges">
          <span className={`badge-pill badge-${itemType}`}>
            {typeLabel}
          </span>
          <span className={`badge-glass status-${statusClass}`}>
            {item.status || 'Open'}
          </span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={item.name}>{item.name || 'Nama Barang'}</h3>
        
        <div className="card-meta">
          <div className="meta-row">
            <FaMapMarkerAlt className="meta-icon" />
            <span className="meta-text truncate">{item.location || 'Lokasi tidak ada'}</span>
          </div>
          <div className="meta-row">
            <FaClock className="meta-icon" />
            <span className="meta-text">
              {format(new Date(item.date || item.created_at), 'd MMM yyyy')}
            </span>
          </div>
        </div>

        <p className="card-description">
          {item.description || 'Tidak ada deskripsi.'}
        </p>

        <div className="card-footer">
          <Link to={`/detail/${item.id}?type=${itemType}`} className="card-btn-link">
            Lihat Detail <FaArrowRight className="btn-arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;