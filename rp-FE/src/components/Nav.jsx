// Nav.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const { user, logout } = useAuth()
  const location = useLocation();

  const getLinkClasses = (path) => {
    // Base classes for all links
    const baseClasses = "text-md font-medium px-3 py-1.5 transition-transform";
    
    // Check if the current path starts with the link path (for /lost vs /lost/report)
    const isActive = location.pathname.startsWith(path) && path !== '/';
    
    // Active state uses Gold accent text
    return isActive
      ? "bg-stone-700 text-amber-500 rounded-full shadow-sm w-15 h-8 flex justify-center items-center" // Navy background, Gold text for active state
      : `${baseClasses} text-slate-700 hover:text-amber-500`; // Slate text, Gold on hover
  };

  return (
    // 🎨 Perubahan 1: Header fixed di atas, dengan padding besar di atas & bawah
    <header className="sticky top-0 z-50 bg-amber-100 pt-8 pb-6">
      
      {/* 🎨 Perubahan 2: Container Navbar BUKAN full-width (hanya max-w-4xl) 
          dan diberi rounded penuh serta shadow yang kuat. */}
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between bg-white rounded-4xl shadow-2xl border border-gray-100">
        
        {/* Brand Name: Navy text with a Gold accent */}
        <Link to="/" className="text-3xl font-extrabold text-stone-700 tracking-wider">
            Return <span className="text-amber-500">Point</span>
        </Link>
        
        <nav className="flex items-center gap-6 p-4">
          
          <Link 
            to="/found" 
            className={getLinkClasses('/found')}
          >
            Found
          </Link>
          <Link 
            to="/lost" 
            className={getLinkClasses('/lost')}
          >
            Lost
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <span className="text-md text-stone-700 font-semibold">Hello, {user.username}</span>
              
              {/* Logout Button: Elevated and uses Red accent */}
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            // Login Button: Navy primary color, elevated
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-stone-700 text-white rounded-xl hover:bg-stone-800 transition-colors font-semibold shadow-xl text-sm"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}