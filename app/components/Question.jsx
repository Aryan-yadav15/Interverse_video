import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';

const Question = ({ InterviewQuestion, activeQuestion, setActiveQuestion }) => {

    const textToSpeach = (text) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const speech = new SpeechSynthesisUtterance(text);
            synth.speak(speech);
        } else {
            alert('Your browser does not support text to speech');
        }
    };

    return InterviewQuestion && (
        <div className='p-5 mt-10 border rounded-lg flex flex-col gap-10'>
            <section>
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {InterviewQuestion.map((question, index) => (
                        <h2
                            key={index}
                            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestion === index ? 'bg-emerald-300' : ''}`}
                        >
                            Question # {index + 1}
                        </h2>
                    ))}
                </div>
                <h2 className='py-10 text-lg'>{InterviewQuestion[activeQuestion]?.question}</h2>
                <Volume2 className='cursor-pointer' onClick={() => textToSpeach(InterviewQuestion[activeQuestion]?.question)} />
            </section>

            <div className='border rounded-lg p-5 bg-violet-100'>
                <h2 className='flex gap-2 items-center text-violet-900'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm p-5 text-violet-500'>
                    Click on record answer when you want to answer the question. At the end of the interview we will give you feedback along with the correct answer for each question and your answer to compare it.
                </h2>
            </div>
        </div>
    );
};

export default Question;
