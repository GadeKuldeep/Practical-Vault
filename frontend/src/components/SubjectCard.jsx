import React from 'react'
import { Link } from 'react-router-dom'

export default function SubjectCard({subject}){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{subject.title}</h3>
      <p className="text-sm text-gray-600">{subject.description}</p>
      <div className="mt-2">
        <Link to={`/subject/${subject._id}`} className="text-blue-600 text-sm">View Practicals</Link>
      </div>
    </div>
  )
}
