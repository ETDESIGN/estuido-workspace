'use client'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Error Loading Page</h1>
        <p className="text-slate-600 mb-4">Something went wrong. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
        >
          Reload
        </button>
      </div>
    </div>
  )
}
