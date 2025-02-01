// app/generate/page.tsx

"use client"

import { useState } from 'react';
import QuizForm from '@/components/QuizForm';
import Quiz from '@/components/Quiz';
import { Quiz as QuizType, QuizFormData } from '@/types';
import { useAuth } from "@clerk/nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GeneratePage() {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  const handleSubmit = async (formData: QuizFormData) => {
    if (!userId) {
      setError("You must be logged in to generate a quiz.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(`An error occurred while generating the quiz. Please try again. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = async (score: number) => {
    if (!quiz) return;

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, score }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz results');
      }

      console.log('Quiz submitted successfully');
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      setError('Failed to submit quiz results. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Quiz</h1>
      {!quiz ? (
        <>
          <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        </>
      ) : (
        <Quiz questions={quiz.questions} quizId={quiz.id} onSubmit={handleQuizSubmit} />
      )}
    </div>
  );
}