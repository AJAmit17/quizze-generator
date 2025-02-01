// types.ts

export interface QuizFormData {
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  createdAt: string;
  quiz: {
    title: string;
    description: string;
  };
}

// types/index.ts
export interface CareerRole {
  title: string;
  description: string;
}

export interface CareerPath {
  title: string;
  steps: string[];
}

export interface GuidanceData {
  guidance: string;
  roadmap: string[];
  learningPath: string[];
}

import { z } from 'zod';

export const roleSchema = z.object({
  roles: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  )
});

export const pathSchema = z.object({
  paths: z.array(
    z.object({
      title: z.string(),
      steps: z.array(z.string())
    })
  )
});

export const guidanceSchema = z.object({
  guidance: z.string(),
  roadmap: z.array(z.string()),
  learningPath: z.array(z.string())
});

export interface QuizSubmissionData {
  quizId: string;
  score: number;
}