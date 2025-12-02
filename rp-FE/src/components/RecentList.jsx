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
        const found = foundResponse.data || []
        const lost = lostResponse.data || []
        const merged = [...found, ...lost].sort((a,b)=> new Date(b.date) - new Date(a.date)).slice(0,6)
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
    <section>
      <h2 className="text-2xl font-semibold mb-4">Terbaru</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 && <div className="p-6 bg-white rounded shadow">Belum ada laporan.</div>}
        {items.map(it => <ItemCard key={it.id} item={it} />)}
      </div>
    </section>
  )
}