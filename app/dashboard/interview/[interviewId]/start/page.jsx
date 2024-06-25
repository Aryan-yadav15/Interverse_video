'use client'

import Question from '@/app/components/Question'
import RecordAnswer from '@/app/components/RecordAnswer'
import { db } from '@/utils/db'
import { InterVerseDB } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'

const StartInterview = ({ params }) => {

    const [InterviewQuestion,setInterviewQuestion]=useState()

    useEffect(() => {
        console.log('the new parasm:', params)
        getInterviewDetails();
    }, [params])


    const [activeQuestion,setActiveQuestion]=useState(0);
    const [loading, setLoading] = useState(true);
    const [interviewData, setInterviewData] = useState(null);
    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(InterVerseDB)
                .where(eq(InterVerseDB.mockId, params.interviewId));

            console.log(result);

            const jsonMockResp= JSON.parse(result[0].jsonMockResp)
            setInterviewQuestion(jsonMockResp)
            console.log(jsonMockResp)

            setInterviewData(result[0]);
            
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error("Failed to fetch interview details", error);
            setLoading(false); // Also handle loading state on error
        }
    }
    if (loading) {
        return (
            <div className='my-10 flex justify-center'>
                <p>Loading interview details...</p>
            </div>
        );
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
            <Question 
            activeQuestion={activeQuestion}
            InterviewQuestion={InterviewQuestion}/>

            <RecordAnswer/>
            </div>
        </div>
    )
}

export default StartInterview