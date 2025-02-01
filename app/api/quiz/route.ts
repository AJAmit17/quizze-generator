// api/quiz/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQuiz } from "@/lib/gemini";
import { QuizFormData, QuizQuestion, QuizSubmissionData } from '@/types';
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Check if this is a quiz submission
  if ('quizId' in body && 'score' in body) {
    const { quizId, score }: QuizSubmissionData = body;
    try {
      const quizAttempt = await prisma.quizAttempt.create({
        data: {
          quizId,
          userId,
          score,
        },
      });
      return NextResponse.json(quizAttempt);
    } catch (error) {
      console.error("Failed to submit quiz attempt:", error);
      return NextResponse.json({ error: "Failed to submit quiz attempt" }, { status: 500 });
    }
  }

  // If not a submission, proceed with quiz generation
  const { jobTitle, skills, jobDescription }: QuizFormData = body;
  try {
    console.log("Generating quiz for:", { jobTitle, skills, jobDescription });
    const generatedQuestions: QuizQuestion[] = await generateQuiz(jobTitle, skills, jobDescription);
    
    console.log("Generated questions:", generatedQuestions);
    const quiz = await prisma.quiz.create({
      data: {
        title: jobTitle, // Use jobTitle as the quiz title
        description: jobDescription, // Make sure jobDescription is not undefined
        userId: userId,
        questions: {
          create: generatedQuestions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
    const formattedQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };
    console.log("Formatted quiz:", formattedQuiz);
    return NextResponse.json(formattedQuiz);
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz: " + (error as Error).message }, { status: 500 });
  }
}