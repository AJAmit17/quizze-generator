/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuizQuestion } from '@/types';

interface QuizProps {
  questions: QuizQuestion[];
  quizId: string;
  onSubmit: (score: number) => void;
}

export default function Quiz({ questions, quizId, onSubmit }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    const finalScore = (correct / questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    // Submit the quiz results
    onSubmit(finalScore);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {questions.map((question, qIndex) => (
        <Card key={qIndex} className={showResults ? (answers[qIndex] === question.correctAnswer ? "border-green-500" : "border-red-500") : ""}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Question {qIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{question.question}</p>
            <RadioGroup 
              onValueChange={(value) => handleAnswer(qIndex, parseInt(value))} 
              disabled={showResults}
            >
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                  <Label htmlFor={`q${qIndex}-o${oIndex}`} className={showResults ? (oIndex === question.correctAnswer ? "text-green-600 font-bold" : "") : ""}>
                    {option}
                    {showResults && oIndex === question.correctAnswer && (
                      <CheckCircle2 className="inline ml-2 text-green-500" size={18} />
                    )}
                    {showResults && answers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                      <XCircle className="inline ml-2 text-red-500" size={18} />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {showResults && (
              <Alert className={answers[qIndex] === question.correctAnswer ? "bg-green-900" : "bg-red-900"}>
                <AlertTitle>{answers[qIndex] === question.correctAnswer ? "Correct!" : "Incorrect"}</AlertTitle>
                <AlertDescription>
                  {answers[qIndex] === question.correctAnswer
                    ? "Great job! You selected the correct answer."
                    : `The correct answer is: ${question.options[question.correctAnswer]}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}
      {!showResults && (
        <Button onClick={handleSubmit} className="w-full">Submit Quiz</Button>
      )}
      {showResults && score !== null && (
        <Alert className="bg-blue-50">
          <AlertTitle>Quiz Completed!</AlertTitle>
          <AlertDescription>Your score: {score.toFixed(2)}%</AlertDescription>
        </Alert>
      )}
    </div>
  );
}