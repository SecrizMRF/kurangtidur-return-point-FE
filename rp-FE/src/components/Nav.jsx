import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">Return Point</Link>
        <nav className="flex items-center gap-4">
          <Link to="/found" className="text-slate-700 hover:text-indigo-600">Found</Link>
          <Link to="/lost" className="text-slate-700 hover:text-indigo-600">Lost</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-700">{user.username}</span>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}