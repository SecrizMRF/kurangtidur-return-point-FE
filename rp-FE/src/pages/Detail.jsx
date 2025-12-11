import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaArrowLeft, FaEdit, FaTrashAlt, FaImage, FaMap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/item.service';
import Loader from '../components/Loader';
import '../styles/Detail.css';

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeImage, setActiveImage] = useState('item');   
  const itemType = searchParams.get('type') || 'lost';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await itemService.getItemById(id);
        if (response) {
          setItem(response);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        navigate(`/${itemType}`); 
      } catch (err) {
        console.error(err);
        alert('Failed to delete item.');
      }
    }
  };

  if (loading) return <div className="detail-loading"><Loader /></div>;
  
  if (error || !item) {
    return (
      <div className="detail-error">
        <h2>Item Not Found</h2>
        <p>The item you are looking for might have been removed.</p>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>
    );
  }

  const isOwner = user && (user.id === item.userId || user.role === 'admin');
  const typeLabel = itemType === 'lost' ? 'Lost Item' : 'Found Item';
  const typeClass = itemType === 'lost' ? 'badge-lost' : 'badge-found';

  const displayImage = activeImage === 'item' 
    ? (item.image_url || item.photo) 
    : (item.location_image_url || item.location_photo);

  return (
    <div className="detail-container fade-in">
      <div className="detail-header-nav">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Back to List
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-image-section">
          <div className="image-wrapper">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={item.name} 
                className="detail-image" 
              />
            ) : (
              <div className="detail-placeholder">
                <span>{activeImage === 'item' ? 'No Item Photo' : 'No Location Photo'}</span>
              </div>
            )}
            
            <span className={`detail-type-badge ${typeClass}`}>{typeLabel}</span>
          </div>

          <div className="image-controls">
            <button 
              className={`control-btn ${activeImage === 'item' ? 'active' : ''}`}
              onClick={() => setActiveImage('item')}
            >
              <FaImage /> Foto Barang
            </button>
            <button 
              className={`control-btn ${activeImage === 'location' ? 'active' : ''}`}
              onClick={() => setActiveImage('location')}
              disabled={!item.location_image_url && !item.location_photo} // Disable jika tidak ada foto lokasi
            >
              <FaMap /> Foto Lokasi
            </button>
          </div>
        </div>

        <div className="detail-info-section">
          <div className="info-header">
            <h1 className="item-title">{item.name || item.title}</h1>
            <span className="item-status">{item.status}</span>
          </div>

          <div className="meta-grid">
            <div className="meta-row">
              <FaCalendarAlt className="meta-icon" />
              <div>
                <span className="meta-label">Date</span>
                <p className="meta-value">
                  {item.date ? format(new Date(item.date), 'MMMM d, yyyy') : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="meta-row">
              <FaMapMarkerAlt className="meta-icon" />
              <div>
                <span className="meta-label">Location</span>
                <p className="meta-value">{item.location}</p>
              </div>
            </div>

            <div className="meta-row">
              <FaUser className="meta-icon" />
              <div>
                <span className="meta-label">Reported By</span>
                <p className="meta-value">{item.reporter || 'Anonymous'}</p>
              </div>
            </div>
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="contact-box">
            <h3>Contact Information</h3>
            <div className="contact-content">
              <FaPhone className="contact-icon" />
              <span className="contact-text">{item.contact || item.contact_info}</span>
            </div>
            <p className="contact-hint">
              Hubungi pelapor segera untuk mengatur pengambilan barang.
            </p>
          </div>

          {isOwner && (
            <div className="owner-actions">
              <Link to={`/edit-${itemType}/${item.id}`} className="btn btn-edit">
                <FaEdit /> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-delete">
                <FaTrashAlt /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}