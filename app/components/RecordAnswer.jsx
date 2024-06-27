import Webcam from 'react-webcam'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, WebcamIcon } from 'lucide-react'
import useSpeechToText from 'react-hook-speech-to-text'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIMOdal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

const RecordAnswer = ({ activeQuestion, InterviewQuestion, interviewData }) => {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const { user } = useUser()

    const [loading, setLoading] = useState(false)
    const [userAnswer, setUserAnswer] = useState('')

    // Reset the user answer when active question changes
    useEffect(() => {
        setUserAnswer('');
    }, [activeQuestion]);

    useEffect(() => {
        if (results.length > 0) {
            setUserAnswer(results.map(result => result.transcript).join(' '));
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswerInDb()
        }
    }, [userAnswer])

    const [webCamEnabled, setWebCamEnabled] = useState(false);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText()
        } else {
            startSpeechToText()
        }
    }

    const updateUserAnswerInDb = async () => {
        setLoading(true)
        console.log(userAnswer)

        const feedbackPrompt = "Question:" + InterviewQuestion[activeQuestion]?.question + ',, User Answer:' + userAnswer +
            "depending on question and user answer for given interview question can you give a rating for answer and feedback as area of improvement if any " +
            ",in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

        const result = await chatSession.sendMessage(feedbackPrompt)

        const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
        console.log(mockJsonResp)
        const JsonFeedback = JSON.parse(mockJsonResp)

        const AiResp = await db.insert(UserAnswer)
            .values({
                mockId: interviewData.mockId,
                question: InterviewQuestion[activeQuestion]?.question,
                correctAns: InterviewQuestion[activeQuestion]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedback?.feedback,
                rating: JsonFeedback?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            })

        if (AiResp) {
            toast('Your answer has been recorded successfully')
            setUserAnswer('')
            setResults([])
        }
        setResults([])
        setLoading(false)
    }

    return (
        <div className='p-10 '>
            <div className='flex flex-col justify-center items-center bg-secondary rounded-lg p-5 w-full h-full'>
                <div className="flex flex-col gap-5">
                    {webCamEnabled ? (
                        <div className='flex flex-col justify-center gap-6 items-center'>
                            <Webcam mirrored={true} style={{ height: 400, width: '100%' }}
                                onUserMedia={() => setWebCamEnabled(true)}
                                onUserMediaError={() => setWebCamEnabled(false)}
                            />
                            <Button variant='outline' onClick={() => setWebCamEnabled(false)}>Disable Webcam</Button>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-between items-center gap-10'>
                            <WebcamIcon width={200} height={200} className='' />
                            <Button variant='outline' onClick={() => setWebCamEnabled(true)}>Enable Webcam</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className='pt-5 flex w-full justify-center items-center'>
                <Button
                    disabled={loading}
                    className='bg-emerald-500 text-gray-50'
                    onClick={StartStopRecording}
                >{isRecording ?
                    <h2 className='flex flex-row items-center justify-center gap-5'>
                        <Mic />Recording...
                    </h2>
                    :
                    <h2 className='flex flex-row items-center justify-center gap-2'>
                        <Mic />Record Answer
                    </h2>}</Button>
            </div>
            {/* <Button onClick={() => console.log(userAnswer)}>Show Recorded Answer</Button> */}
        </div>
    )
}

export default RecordAnswer
