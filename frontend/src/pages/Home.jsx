import React, { useEffect, useState } from 'react'
import api from '../services/api'
import SubjectCard from '../components/SubjectCard'
import { toast } from 'react-toastify'

export default function Home(){
  const [subjects, setSubjects] = useState([])
  useEffect(()=>{ fetchSubjects() }, [])
  const fetchSubjects = async ()=>{
    try{ const { data } = await api.get('/api/subjects'); setSubjects(data) }catch(e){ toast.error('Failed to load subjects') }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to PracticalVault</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(s=> <SubjectCard key={s._id} subject={s} />)}
      </div>
    </div>
  )
}
