// pages/DisplayPage.js
"use client"
import React, { useEffect, useState } from 'react'

export default function DisplayPage() {
  const [data, setData] = useState({ name: '', description: '' })

  useEffect(() => {
    // Retrieve data from local storage
    const savedData = localStorage.getItem('formData')
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Stored Data</h2>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Description:</strong> {data.description}
        </p>
      </div>
    </div>
  )
}
