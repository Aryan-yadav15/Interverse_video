'use client'

import Webcam from 'react-webcam'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WebcamIcon } from 'lucide-react'
import useSpeechToText from 'react-hook-speech-to-text'

const RecordAnswer = () => {

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const [webCamEnabled, setWebCamEnabled] = useState(true);

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
                            <Button onClick={() => setWebCamEnabled(false)}>Disable Webcam</Button>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-between items-center gap-10'>
                            <WebcamIcon width={200} height={200} className='' />
                            <Button onClick={() => setWebCamEnabled(true)}>Enable Webcam</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className='pt-5'>
                <Button className='bg-emerald-500 text-gray-50'>Record Answer</Button>
            </div>
            <h1>Recording: {isRecording.toString()}</h1>
            <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <ul>
                {results.map((result) => (
                    <li key={result.timestamp}>{result.transcript}</li>
                ))}
                {interimResult && <li>{interimResult}</li>}
            </ul>
        </div>
    )
}

export default RecordAnswer