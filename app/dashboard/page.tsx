// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import { Button } from '@/components/ui/button';


interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
}

interface Quiz {
  id: string;
  title: string;
  domain: string;
  topic: string;
  difficulty: string;
}

export default function DashboardPage() {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [quizDetails, setQuizDetails] = useState<{ [quizId: string]: Quiz }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      if (!userId) {
        setError("You must be logged in to view your dashboard.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/quizAttempts?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz attempts');
        }
        const data = await response.json();
        setQuizAttempts(data);

        // Fetch quiz details for each quiz attempt
        const quizDetailsPromises = data.map(async (attempt: QuizAttempt) => {
          const quizResponse = await fetch(`/api/quiz/${attempt.quizId}`);
          if (!quizResponse.ok) {
            throw new Error('Failed to fetch quiz details');
          }
          const quizData = await quizResponse.json();
          return { quizId: attempt.quizId, quizData };
        });

        const quizDetailsResults = await Promise.all(quizDetailsPromises);
        const quizDetailsMap = quizDetailsResults.reduce((acc, { quizId, quizData }) => {
          acc[quizId] = quizData;
          return acc;
        }, {} as { [quizId: string]: Quiz });

        setQuizDetails(quizDetailsMap);
      } catch (err) {
        setError(`An error occurred while fetching quiz attempts. Please try again. : ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [userId]);

  const handleQuizClick = (quizId: string) => {
    if (quizId) {
      router.push(`/quiz/${quizId}`);
    } else {
      setError("Invalid quiz ID.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      {isLoading && <h1>loading...</h1>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!isLoading && !error && quizAttempts.length === 0 && <p>No quiz attempts found.</p>}
      {!isLoading && !error && quizAttempts.length > 0 && (
        <div className="space-y-8">
          {quizAttempts.map((attempt, index) => (
            <Card key={index} onClick={() => handleQuizClick(attempt.quizId)} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{quizDetails[attempt.quizId]?.title || 'N/A'}</CardTitle>
                <CardDescription>
                  Domain: {quizDetails[attempt.quizId]?.domain || 'N/A'} | 
                  Topic: {quizDetails[attempt.quizId]?.topic || 'N/A'} | 
                  Difficulty: {quizDetails[attempt.quizId]?.difficulty || 'N/A'}
                </CardDescription>
                <CardDescription>Score: {attempt.score.toFixed(2)}%</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleQuizClick(attempt.quizId)}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}