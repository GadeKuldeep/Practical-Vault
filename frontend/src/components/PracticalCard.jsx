import React from 'react'
import CopyButton from './CopyButton'

export default function PracticalCard({p}){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">{p.title}</h4>
          <p className="text-sm text-gray-600">{p.description}</p>
        </div>
        <div className="text-right">
          <CopyButton text={p.code} />
        </div>
      </div>
    </div>
  )
}
