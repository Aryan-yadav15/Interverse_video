'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/GeminiAIMOdal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { InterVerseDB } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'



const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExp, setJobExp] = useState("");
    const [responseContent, setResponseContent] = useState(""); // Ensure this state is defined
    const [loading, setLoading] = useState(false)
    const [jsonResponse, setJsonResponse] = useState([])

    const router = useRouter();

    const { user } = useUser();


    const handleJobPositionChange = (event) => {
        setJobPosition(event.target.value);
    };

    const handleJobDescChange = (event) => {
        setJobDesc(event.target.value);
    };

    const handleJobExpChange = (event) => {
        setJobExp(event.target.value);
    };

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExp);

        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExp}. According to the experience and description, generate 5 interview questions with answers, and provide the questions and answers in JSON format.`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);

            if (result.response && result.response.candidates && result.response.candidates.length > 0) {
                let text = result.response.candidates[0].content.parts[0].text;
                console.log('Original Text:', text);  // Log the original text for debugging

                // Clean the text
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                console.log('Cleaned Text:', text);  // Log the cleaned text for debugging

                // Add commas between question and answer if missing
                text = text.replace(/(\d})\s*("answer")/g, '$1,$2');  // Add commas before "answer" if missing
                console.log('Corrected Text:', text);  // Log the corrected text for debugging

                // Attempt to parse the JSON
                try {
                    const parsedResponse = JSON.parse(text);
                    setResponseContent(JSON.stringify(parsedResponse, null, 2));
                    setJsonResponse(text);

                    if (text) {
                        const resp = await db.insert(InterVerseDB)
                            .values({
                                mockId: uuidv4(),
                                jsonMockResp: text,
                                jobPosition: jobPosition,
                                jobDesc: jobDesc,
                                jobExperience: jobExp,
                                createdBy: user?.primaryEmailAddress.emailAddress,
                                createdAt: moment().format('DD-MM-YYYY')
                            }).returning({ mockId: InterVerseDB.mockId });

                        console.log("Inserted ID:", resp);

                        if (resp) {
                            setOpenDialog(false);
                            router.push('/dashboard/interview/' + resp[0]?.mockId);
                        }
                    } else {
                        console.error("No response found");
                    }

                    console.log(jsonResponse);
                } catch (jsonError) {
                    console.error("Error parsing JSON:", jsonError);
                    console.error("Problematic Text:", text);  // Log the problematic text for further analysis
                } finally {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setLoading(false);
        }

    };

    return (
        <div className='pt-10'>
            <div className='p-10 border-2 rounded-lg bg-secondary hover:scale-105 hover:shadow-lg cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-medium text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className='max-w-xl'>
                    <DialogHeader>
                        <DialogTitle className='font-semibold text-2xl'>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details About your Job Position/Role, Job Description, and Years of Experience</h2>
                                    <div className='py-5'>
                                        <label className='text-gray-900 font-semibold'>Job Role/Job Position</label>
                                        <Input
                                            placeholder="Ex. FullStack Developer"
                                            value={jobPosition}
                                            required
                                            onChange={handleJobPositionChange}
                                        />
                                    </div>
                                    <div className='py-5'>
                                        <label className='text-gray-900 font-semibold'>Job Description/Tech Stack (In Short)</label>
                                        <Textarea
                                            placeholder="Ex. React, Angular, NodeJS"
                                            value={jobDesc}
                                            required
                                            onChange={handleJobDescChange}
                                        />
                                    </div>
                                    <div className='py-5'>
                                        <label className='text-gray-900 font-semibold'>Years of Experience</label>
                                        <Input
                                            placeholder="5"
                                            type="number"
                                            max="20"
                                            value={jobExp}
                                            required
                                            onChange={handleJobExpChange}
                                        />
                                    </div>
                                    <div className='flex gap-5 justify-between pt-5'>
                                        <Button type='button' variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                        <Button type='submit' disabled={loading}>
                                            {loading ?
                                                <>
                                                    <LoaderCircle className='animate-spin' />'Genrating Response'
                                                </>
                                                : 'Start Interview'
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;
