import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

const Dashboard = () => {
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold'>Dashboard</h2>
      <h2 className='text-gray-600'>Create and start your AI Mock INterview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mr-5">
        <AddNewInterview/>
      </div>
    </div>
  )
}

export default Dashboard