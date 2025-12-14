// Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import RecentList from '../components/RecentList'

export default function Home() {
  return (
    // 1. Container Utama: Sekarang menggunakan Navy/Slate 900 Background
    <main className="max-w-6xl mx-auto p-6 bg-slate-700 min-h-screen rounded-2xl"> 
      
      {/* 2. Hero Section: White/Cream Background */}
      <section className="bg-white p-10 rounded-2xl mb-12 shadow-2xl transform hover:shadow-2xl transition duration-300">
        
        {/* Title with Gold Accent - Teks utama sekarang Slate 900 */}
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          <span className="text-amber-500">Return </span>Point
        </h1>
        <p className="mt-3 max-w-xl text-lg font-light text-gray-600">
          Semoga yang hilang dapat kembali, dan yang menemukan dapat merasa berarti.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap">
          
          {/* Laporkan Penemuan - Gold */}
          <Link 
            to="/report/found" 
            className="px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors transform hover:scale-[1.05]"
          >
            Laporkan Penemuan
          </Link>
          
          {/* Laporkan Kehilangan - Navy/Slate 900 primary color */}
          <Link 
            to="/report/lost" 
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-colors transform hover:scale-[1.05]"
          >
            Laporkan Kehilangan
          </Link>
          
          {/* Lihat Barang Ditemukan - Bordered Gold/Navy */}
          {/* <Link 
            to="/found" 
            className="px-6 py-3 border border-amber-500 text-amber-500 font-semibold rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-colors"
          >
            Lihat Barang Ditemukan
          </Link> */}
        </div>
      </section>

      {/* 3. RecentList Section - Menyesuaikan warna heading agar terlihat di background Navy */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-amber-500 mb-6 border-b border-slate-700 pb-2">Recent Items</h2>
        <RecentList />
      </div>

    </main>
  )
}