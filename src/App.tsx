import { useState } from 'react'
// import './App.css'

function App() {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-blue-600">
          🎉 Tailwind is working!
        </h1>
        <p className="mt-4 text-gray-600">
          If you can see a white card on a dark background with blue text,
          Tailwind is configured correctly.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
          Test Button
        </button>
      </div>
    </div>
    </>
  )
}

export default App
