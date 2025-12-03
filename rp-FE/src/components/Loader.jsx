// Loader.jsx
import React from 'react'

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      {/* Changed border color to Navy (stone-700) */}
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-stone-700"></div>
    </div>
  )
}