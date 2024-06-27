'use client';

import { db } from '@/utils/db';
import { InterVerseDB } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewCard from './InterviewCard';

const AllInterview = () => {
    const { user } = useUser();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        if (user) {
            getInterviewList();
        }
    }, [user]);

    const getInterviewList = async () => {
        try {
            const result = await db.select().from(InterVerseDB)
                .where(eq(InterVerseDB.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(InterVerseDB.id));
            console.log(result);
            setInterviews(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
        }
    };

    const deleteInterview = async (id) => {
        try {
            await db.delete(InterVerseDB).where(eq(InterVerseDB.id, id));
            setInterviews(interviews.filter(interview => interview.id !== id));
        } catch (error) {
            console.error("Error deleting interview:", error);
        }
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-emerald-500'>Previous Mock Interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviews.map((interview, index) => (
                    <InterviewCard key={index} interview={interview} onDelete={deleteInterview} />
                ))}
            </div>
        </div>
    );
};

export default AllInterview;
