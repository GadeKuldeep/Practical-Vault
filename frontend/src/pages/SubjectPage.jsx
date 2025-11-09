import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import PracticalCard from '../components/PracticalCard'
import { toast } from 'react-toastify'

export default function SubjectPage(){
  const { id } = useParams()
  const [practicals, setPracticals] = useState([])
  const [subject, setSubject] = useState(null)
  useEffect(()=>{ fetchData() }, [id])
  const fetchData = async ()=>{
    try{
      const s = await api.get(`/api/subjects`)
      setSubject(s.data.find(x=> x._id===id) || null)
      const { data } = await api.get(`/api/practicals/subject/${id}`)
      setPracticals(data)
    }catch(e){ toast.error('Failed to load practicals') }
  }
  return (
    <div>
      <h2 className="text-xl font-semibold">{subject?.title || 'Subject'}</h2>
      <p className="text-sm text-gray-600">{subject?.description}</p>
      <div className="mt-4 space-y-3">
        {practicals.map(p=> <PracticalCard key={p._id} p={p} />)}
      </div>
    </div>
  )
}
