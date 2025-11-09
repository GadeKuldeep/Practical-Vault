import React from 'react'
import { toast } from 'react-toastify'

export default function CopyButton({ text }){
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text || '')
      toast.success('Copied to clipboard')
    } catch (err) {
      toast.error('Copy failed')
    }
  }
  return (
    <button onClick={copy} className="px-3 py-1 bg-gray-100 rounded text-sm">Copy Code</button>
  )
}
