import React, { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const handleChange = (e)=> setForm({...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const { data } = await api.post('/api/auth/login', form)
      localStorage.setItem('token', data.token)
      toast.success('Logged in')
      navigate('/admin/dashboard')
    }catch(e){ toast.error(e.response?.data?.message || 'Login failed') }
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}
