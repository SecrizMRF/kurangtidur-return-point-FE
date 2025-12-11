import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import '../styles/Nav.css';

export default function Nav() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    showToast('Kamu sudah berhasil logout. Sampai jumpa kembali yaa!', 'success', 'Logout Berhasil');
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="nav-wrapper">
        <header className="nav-glass">
          <Link to="/" className="nav-brand">
            Return<span className="brand-dot">Point</span>
          </Link>
          
          <nav className="nav-menu">
            {user ? (
              <>
                <div className="nav-links-group">
                  <Link 
                    to="/found" 
                    className={`nav-link ${location.pathname.startsWith('/found') ? 'active' : ''}`}
                  >
                    Found Items
                  </Link>
                  <Link 
                    to="/lost" 
                    className={`nav-link ${location.pathname.startsWith('/lost') ? 'active' : ''}`}
                  >
                    Lost Items
                  </Link>
                </div>

                <div className="nav-separator"></div>

                <div className="user-profile">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user.username}</span>
                  </div>
                  <button onClick={handleLogoutClick} className="btn-logout-icon" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-group">
                <Link to="/login" className="nav-auth-link">
                  Sign In
                </Link>
                <Link to="/register" className="btn-signup-pill">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </header>
      </div>

      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Sign Out?"
        message="Apakah Anda yakin ingin keluar dari akun Anda saat ini?"
        confirmText="Logout"
        isDanger={true}
        icon={<FaSignOutAlt />}
      />
    </>
  );
}