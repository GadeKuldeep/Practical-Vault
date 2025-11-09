import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [form, setForm] = useState({ title: '', description: '' })
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [activeTab, setActiveTab] = useState('details') // 'details' | 'practicals'
  const [practicals, setPracticals] = useState([])
  const [practicalForm, setPracticalForm] = useState({ title: '', description: '', code: '', tags: '' })
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const { data } = await api.get('/api/subjects')
      setSubjects(data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) { toast.error('You must be logged in as admin to perform this action'); navigate('/admin/login'); return }
    try {
      if (editingSubject) {
        await api.put(`/api/subjects/${editingSubject._id}`, form)
        toast.success('Subject updated')
      } else {
        await api.post('/api/subjects', form)
        toast.success('Subject created')
      }
      setForm({ title: '', description: '' })
      setEditingSubject(null)
      setShowForm(false)
      loadSubjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setForm({ title: subject.title, description: subject.description || '' })
    setShowForm(true)
  }

  const handleSelect = async (subject) => {
    setSelectedSubject(subject)
    setActiveTab('details')
    // preload practicals
    try {
      const { data } = await api.get(`/api/practicals/subject/${subject._id}`)
      setPracticals(data || [])
    } catch (err) {
      // ignore — UI will show empty
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        if (!token) { toast.error('You must be logged in as admin to perform this action'); navigate('/admin/login'); return }
        await api.delete(`/api/subjects/${id}`)
        toast.success('Subject deleted')
        loadSubjects()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed')
      }
    }
  }

  // practicals handlers
  const loadPracticals = async (subjectId) => {
    try {
      const { data } = await api.get(`/api/practicals/subject/${subjectId}`)
      setPracticals(data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load practicals')
    }
  }

  const handlePracticalSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSubject) return toast.error('Select a subject first')
    if (!token) { toast.error('You must be logged in as admin to perform this action'); navigate('/admin/login'); return }
    try {
      const payload = { ...practicalForm, subject: selectedSubject._id, tags: practicalForm.tags ? practicalForm.tags.split(',').map(t=>t.trim()).filter(Boolean) : [] }
      await api.post('/api/practicals', payload)
      toast.success('Practical added')
      setPracticalForm({ title: '', description: '', code: '', tags: '' })
      await loadPracticals(selectedSubject._id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add practical')
    }
  }

  const handleDeletePractical = async (id) => {
    if (!window.confirm('Delete this practical?')) return
    try {
      if (!token) { toast.error('You must be logged in as admin to perform this action'); navigate('/admin/login'); return }
      await api.delete(`/api/practicals/${id}`)
      toast.success('Practical deleted')
      if (selectedSubject) loadPracticals(selectedSubject._id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl mb-4">{editingSubject ? 'Edit' : 'Add'} Subject</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded"
              rows="3"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {editingSubject ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingSubject(null)
                  setForm({ title: '', description: '' })
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.length === 0 ? (
            <div className="p-4 bg-yellow-50 rounded col-span-full">
              No subjects yet. Click "Add Subject" to create one.
            </div>
          ) : subjects.map((s) => (
            <div key={s._id} className="p-4 border rounded shadow-sm bg-white cursor-pointer" onClick={()=>handleSelect(s)}>
              <h3 className="font-medium text-lg">{s.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(s) }}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(s._id) }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Subject detail / practicals panel */}
      {selectedSubject && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedSubject.title}</h2>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded ${activeTab==='details' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={()=>setActiveTab('details')}>Details</button>
              <button className={`px-3 py-1 rounded ${activeTab==='practicals' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={async ()=>{ setActiveTab('practicals'); await loadPracticals(selectedSubject._id) }}>Practicals</button>
              <button className="px-3 py-1 rounded bg-red-100 text-red-700" onClick={()=>setSelectedSubject(null)}>Close</button>
            </div>
          </div>

          {activeTab === 'details' && (
            <div>
              <p className="text-sm text-gray-600">{selectedSubject.description}</p>
              <div className="mt-4">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={()=>{ setShowForm(true); setEditingSubject(selectedSubject); setForm({ title: selectedSubject.title, description: selectedSubject.description || '' }) }}>Edit Subject</button>
              </div>
            </div>
          )}

          {activeTab === 'practicals' && (
            <div>
              <h3 className="font-medium mb-3">Practicals for {selectedSubject.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {practicals.length === 0 ? <div className="p-3 bg-yellow-50 rounded col-span-full">No practicals yet.</div> : practicals.map(p => (
                  <div key={p._id} className="p-3 border rounded bg-white">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">{p.title}</h4>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={()=>handleDeletePractical(p._id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">Add Practical</h4>
                <form onSubmit={handlePracticalSubmit} className="space-y-3">
                  <input required value={practicalForm.title} onChange={e=>setPracticalForm({...practicalForm, title: e.target.value})} placeholder="Title" className="w-full border p-2 rounded" />
                  <textarea value={practicalForm.description} onChange={e=>setPracticalForm({...practicalForm, description: e.target.value})} placeholder="Description" className="w-full border p-2 rounded" rows={3} />
                  <textarea value={practicalForm.code} onChange={e=>setPracticalForm({...practicalForm, code: e.target.value})} placeholder="Code (optional)" className="w-full border p-2 rounded" rows={4} />
                  <input value={practicalForm.tags} onChange={e=>setPracticalForm({...practicalForm, tags: e.target.value})} placeholder="Tags (comma separated)" className="w-full border p-2 rounded" />
                  <div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Practical</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}