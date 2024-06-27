'use client'

import React, { useEffect, useState } from 'react';
import Question from '@/app/components/Question';
import RecordAnswer from '@/app/components/RecordAnswer';
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { InterVerseDB } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

const StartInterview = ({ params }) => {
    const [InterviewQuestion, setInterviewQuestion] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [interviewData, setInterviewData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getInterviewDetails();
    }, [params]);

    const getInterviewDetails = async (retryCount = 0) => {
        try {
            if (!params || !params.interviewId) {
                throw new Error("Missing interview ID in params");
            }

            const result = await db.select().from(InterVerseDB)
                .where(eq(InterVerseDB.mockId, params.interviewId));

            console.log("Database query result:", result);

            if (result.length === 0) {
                throw new Error("No interview details found for the given ID");
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch interview details", error);
            if (retryCount < 3) {
                setTimeout(() => getInterviewDetails(retryCount + 1), 1000); // Retry after 1 second
            } else {
                setError(error.message);
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className='my-10 flex justify-center'>
                <p>Loading interview details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='my-10 flex justify-center'>
                <p>Error loading interview details: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <Question
                    activeQuestion={activeQuestion}
                    setActiveQuestion={setActiveQuestion}
                    InterviewQuestion={InterviewQuestion}
                    interviewData={interviewData}
                />

                <RecordAnswer
                    activeQuestion={activeQuestion}
                    InterviewQuestion={InterviewQuestion}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-center gap-6 items-end py-10'>
                {activeQuestion > 0 &&
                    <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>
                        Previous
                    </Button>
                }
                {activeQuestion == InterviewQuestion.length - 1 &&
                    <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
                        <Button variant='destructive'>
                            End Interview
                        </Button>
                    </Link>
                }
                {activeQuestion != InterviewQuestion.length - 1 &&
                    <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>
                        Next
                    </Button>
                }
            </div>
        </div>
    );
}

export default StartInterview;
