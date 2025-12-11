import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import itemService from '../services/item.service';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import { FaSearch, FaFilter, FaPlus, FaSort, FaExclamationCircle, FaBoxOpen } from 'react-icons/fa';
import '../styles/ListPage.css';

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
          type: type,
          status: filters.status,
          search: debouncedSearch
        };
        
        const response = await itemService.getItems(params);
        
        let itemsArray = [];
        if (response && response.data) {
          itemsArray = Array.isArray(response.data) 
            ? response.data.map(item => ({ ...item, type: item.type || type })) 
            : [];
        }
        
        if (filters.sort === 'newest') {
          itemsArray.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        } else {
          itemsArray.sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at));
        }
        
        setItems(itemsArray);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message || 'Failed to load items. Please check your connection.');
        setItems([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type, filters.status, debouncedSearch, filters.sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const isLost = type === 'lost';
  const pageTitle = isLost ? 'Barang Hilang' : 'Barang Ditemukan';
  const pageSubtitle = isLost 
    ? 'Telusuri daftar barang yang dilaporkan hilang oleh komunitas.' 
    : 'Lihat barang yang telah ditemukan dan menunggu pemiliknya.';

  return (
    <div className="list-page-wrapper">
      
      <header className="list-header">
        <div className="header-bg-decoration"></div>
        <div className="container header-content">
          <div className="header-text">
            <span className={`header-badge ${isLost ? 'badge-red' : 'badge-gold'}`}>
              {isLost ? 'Lost Items' : 'Found Items'}
            </span>
            <h1 className="header-title">{pageTitle}</h1>
            <p className="header-subtitle">{pageSubtitle}</p>
          </div>
          
          <div className="header-action">
            <Link to={`/report/${type}`} className="btn-create-report">
              <FaPlus className="icon-btn" />
              {isLost ? 'Lapor Kehilangan' : 'Lapor Penemuan'}
            </Link>
          </div>
        </div>
      </header>

      <div className="toolbar-wrapper container">
        <div className="toolbar-glass">
          
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Cari nama barang, lokasi, atau ciri-ciri..."
              className="search-input-transparent"
            />
          </div>

          <div className="filters-group">
            <div className="select-wrapper">
              <FaFilter className="select-icon" />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="select-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="dicari">Dicari</option>
                <option value="ditemukan">Ditemukan</option>
                <option value="diclaim">Selesai</option>
              </select>
            </div>

            <div className="divider-vertical"></div>

            <div className="select-wrapper">
              <FaSort className="select-icon" />
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="select-transparent"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <section className="list-content container">
        {loading ? (
          <div className="loading-state">
            <Loader />
            <p>Memuat data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <FaExclamationCircle className="state-icon text-danger" />
            <h3>Gagal Memuat Data</h3>
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-circle">
              <FaBoxOpen />
            </div>
            <h3>Belum ada data {isLost ? 'kehilangan' : 'penemuan'}.</h3>
            <p>Cobalah ubah filter pencarian Anda atau jadilah yang pertama melapor.</p>
            <Link to={`/report/${type}`} className="btn-empty-action">
              Buat Laporan Baru
            </Link>
          </div>
        ) : (
          <>
            <p className="result-count">Menampilkan <strong>{items.length}</strong> hasil</p>
            <div className="grid-layout">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ListPage;