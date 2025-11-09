import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/') }
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">PracticalVault</Link>
        <div className="space-x-3">
          <Link to="/" className="text-gray-700">Home</Link>
          {token ? (
            <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          ) : (
            <Link to="/admin/login" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Admin</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
