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

export interface QuizSubmissionData {
  quizId: string;
  score: number;
}