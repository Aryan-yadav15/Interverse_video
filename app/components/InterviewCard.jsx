import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { Trash } from 'lucide-react';

const InterviewCard = ({ interview, onDelete }) => {
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-gray-600 capitalize'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-800'>{interview.jobExperience} Years of Experience</h2>
      <h2 className="text-xs text-gray-500">Created At: {interview.createdAt}</h2>
      <div className="flex flex-row justify-between gap-5 pt-5">
        <Link className='flex-1' href={'/dashboard/interview/' + interview?.mockId + '/feedback'}>
          <Button size='sm' variant='' className='w-full bg-green-500 text-white border'>Feedback</Button>
        </Link>
        <Link className='flex-1' href={'/dashboard/interview/' + interview?.mockId}>
          <Button size='sm' variant='' className='w-full'>Start</Button>
        </Link>
        <button onClick={() => onDelete(interview.id)} className='flex items-center justify-center p-2 bg-red-500 text-white rounded'>
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
