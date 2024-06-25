'use client'

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { InterVerseDB } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        if (params.interviewId) {
            console.log(params);
            getInterviewDetails();
        }
    }, [params]); // Add params as a dependency to useEffect

    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(InterVerseDB)
                .where(eq(InterVerseDB.mockId, params.interviewId));

            console.log(result);
            setInterviewData(result[0]);
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error("Failed to fetch interview details", error);
            setLoading(false); // Also handle loading state on error
        }
    }

    // Render loading state if data is still loading
    if (loading) {
        return (
            <div className='my-10 flex justify-center'>
                <p>Loading interview details...</p>
            </div>
        );
    }

    // Render the component when interviewData is defined
    return (
        <div className='my-10 '>
            <h2 className='font-bold text-3xl mb-8 text-center'>Let's Get Started</h2>
            <div className="flex flex-col md:flex-row items-center justify-evenly gap-12">
                <div className="flex flex-col gap-6 max-w-xl">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className='text-xl font-semibold mb-4'>Job Details</h2>
                        <div className='flex flex-col gap-2'>
                            <p><strong>Job Role/Position:</strong> {interviewData?.jobPosition || 'Not Available'}</p>
                            <p><strong>Job Desc/Tech Stack:</strong> {interviewData?.jobDesc || 'Not Available'}</p>
                            <p><strong>Years of Experience:</strong> {interviewData?.jobExperience || 'Not Available'}</p>
                        </div>
                    </div>
                    <div className='bg-yellow-200 p-6 rounded-lg shadow-md border border-yellow-400'>
                        <h2 className='flex items-center gap-3 text-xl font-semibold'>
                            <Lightbulb className='w-6 h-6 text-yellow-700' />
                            <span>Information</span>
                        </h2>
                        <p className='text-gray-700 mt-2'>
                            For an enhanced interview experience, we request access to your camera. Please note:
                        </p>
                        <ul className='list-disc list-inside text-gray-700 mt-2'>
                            <li>We do not record any video or audio.</li>
                            <li>You can disable the camera if you prefer.</li>
                            <li>Enabling your camera allows for a more interactive and engaging interview process.</li>
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    {webCamEnabled ?
                        <div className='flex flex-col justify-center items-center'>
                            <Webcam mirrored={true} style={{ height: 300, width: 300 }}
                                onUserMedia={() => setWebCamEnabled(true)}
                                onUserMediaError={() => setWebCamEnabled(false)}
                            />
                            <Button onClick={() => {
                                setWebCamEnabled(false)
                            }}>Disable Webcam</Button>
                        </div>
                        :
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <WebcamIcon className='h-72 w-full  rounded-lg p-20 bg-secondary border' />
                            <Button onClick={() => {
                                setWebCamEnabled(true)
                            }}>Enable Webcam</Button>
                        </div>
                    }
                </div>
            </div>
            <div className='flex justify-center pt-20'>
                <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
                    <Button variant="destructive">Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
