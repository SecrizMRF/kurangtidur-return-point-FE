import React from 'react'
import { Link } from 'react-router-dom'
import RecentList from '../components/RecentList'

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="bg-linear-to-r from-indigo-600 to-indigo-400 text-white p-8 rounded-lg mb-8 shadow">
        <h1 className="text-4xl font-bold">Return Point</h1>
        <p className="mt-2 max-w-xl">Cari barang hilang atau laporkan barang yang kamu temukan — cepat, mudah, dan aman.</p>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link to="/report/found" className="px-4 py-2 bg-green-500 rounded shadow">Laporkan Penemuan</Link>
          <Link to="/report/lost" className="px-4 py-2 bg-yellow-400 rounded shadow">Laporkan Kehilangan</Link>
          <Link to="/found" className="px-4 py-2 bg-white text-indigo-600 rounded shadow">Lihat Barang Ditemukan</Link>
        </div>
      </section>

      <RecentList />
    </main>
  )
}