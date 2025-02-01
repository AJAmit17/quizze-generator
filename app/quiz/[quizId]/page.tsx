// app/quiz/[quizId]/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    createdAt: string;
    userId: string;
}

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export default function QuizDetailsPage({ params }: { params: { quizId: string } }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchQuizDetails = async () => {
            if (!userId) {
                setError("You must be logged in to view quiz details.");
                return;
            }

            if (!params.quizId) {
                setError("Invalid quiz ID.");
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/quiz/${params.quizId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz details');
                }
                const data = await response.json();
                setQuiz(data);
            } catch (err) {
                setError(`An error occurred while fetching quiz details. Please try again. ${err}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizDetails();
    }, [userId, params.quizId]);

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <p className="text-red-500 mt-4">{error}</p>;
    }

    if (!quiz) {
        return <p>No quiz details found.</p>;
    }

    console.log(quiz)

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">Created at: {format(new Date(quiz.createdAt), 'MMMM d, yyyy h:mm a')}</p>
                    <div className="space-y-8">
                        {quiz.questions.map((question, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{question.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside mt-2">
                                        {question.options.map((option, idx) => (
                                            <li key={idx} className={`${idx === question.correctAnswer ? 'text-green-500' : ''}`}>
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={() => router.back()} className="mt-8">
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}