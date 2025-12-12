// RecentList.jsx
import React, { useEffect, useState } from 'react'
import foundService from '../services/found.service'
import lostService from '../services/lost.service'
import ItemCard from './ItemCard'
import Loader from './Loader'

export default function RecentList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchLatest() {
      try {
        // fetch both found and lost and merge (backend should support limit)
        const [foundResponse, lostResponse] = await Promise.all([foundService.getFoundItems(), lostService.getLostItems()])
        if (!mounted) return
        // Extract data from API responses and merge
        const found = (foundResponse.data || []).map(item => ({...item, type: 'found'}));
        const lost = (lostResponse.data || []).map(item => ({...item, type: 'lost'}));
        
        // Ensure type is explicitly set for merging to help ItemCard
        const merged = [...found, ...lost].sort((a,b)=> new Date(b.date || b.created_at) - new Date(a.date || a.created_at)).slice(0,6)
        setItems(merged)
      } catch (e) {
        console.error(e)
      } finally { setLoading(false) }
    }
    fetchLatest()
    return () => { mounted = false }
  }, [])

  if (loading) return <Loader />

  return (
    <section className="py-8">
      {/* Changed text color to Navy */}
      <h2 className="text-3xl font-bold text-white mb-6">Latest Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 && <div className="p-8 bg-white rounded-xl shadow-lg text-gray-600 col-span-full text-center">No reports have been submitted yet.</div>}
        {items.map(it => <ItemCard key={it.id} item={it} />)}
      </div>
    </section>
  )
}