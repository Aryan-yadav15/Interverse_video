import { Lightbulb } from 'lucide-react'
import React from 'react'

const Question = ({ InterviewQuestion, activeQuestion }) => {
    return InterviewQuestion && (
        <div className='p-5 mt-10 border rounded-lg flex  flex-col gap-10'>
            <section>
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {InterviewQuestion && InterviewQuestion.map((question, index) => (
                        <h2 key={index} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestion == index && 'bg-emerald-300'}`}>Question # {index + 1}</h2>
                    ))}
                </div>
                <h2 className='py-10 text-lg'>{InterviewQuestion[activeQuestion]?.question}</h2>
            </section>

            <div className='border rounded-lg p-5 bg-violet-100'>
                <h2 className='flex gap-2 items-center text-violet-900'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm p-5 text-violet-500'>Click on record answer when you want to answer the question . At the end of the interview we will give you a feedback along with correct answer for each question and your answer to comapre it </h2>
            </div>
        </div>
    )
}

export default Question