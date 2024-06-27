'use client'

import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'



const Feddback = ({ params }) => {

  const [feedbackList, setFeedbackList] = useState([])
  const router = useRouter()

  const getFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockId, params.interviewId))
      .orderBy(UserAnswer.id)

    setFeedbackList(result)
    // console.log(result)
  }

  useEffect(() => {
    getFeedback();
  }, [params]);

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl text-emerald-500'>Congrats on finishing</h2>
      <h2 className=' py-2 font-bold text-xl'>You can Learn From th feedback provided</h2>
      {feedbackList?.length == 0 ?
        <h2 className='text-lg font-semibold'>No interview Feedback Available</h2>
        :
        <>
          <h2 className="text-primary">Your Overall Interview Rating: <strong>{feedbackList.rating}</strong> </h2>
          <h2 className='text-sm text-gray-500 py-2'>Find Below interview Question with correct answer , Your answer and feedback for improvement</h2>
          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-5'>
              <CollapsibleTrigger className=' bg-gray-100 justify-between rounded-lg my-2 text-left flex flex-row gap-5 w-full p-5'>
                {item.question}<ChevronsUpDown />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <div className=''>
                    <h2 className='border inline-block p-2 rounded-md'><strong>Rating:</strong>{item.rating}</h2>
                  </div>
                  <h2 className='p-2 border rounded-md bg-purple-200'><strong className='mr-2'>Your Answer:</strong>{item.userAns}</h2>
                  <h2 className='p-2 border rounded-md bg-emerald-200'><strong className='mr-2'>Correct Answer:</strong>{item.correctAns}</h2>
                  <h2 className='p-2 border rounded-md text-gray-50 bg-gray-800'><strong className='mr-2'>Feedback:</strong>{item.feedback}</h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

        </>
      }
      <Button onClick={() => router.replace('/dashboard')} className='mt-10'>Go Home</Button>
    </div>
  )
}

export default Feddback