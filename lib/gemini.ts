import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from '@/types';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export async function generateQuiz(
  domain: string,
  difficulty: DifficultyLevel,
  topic: string
): Promise<QuizQuestion[]> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate an educational quiz for students with the following parameters:
    Domain: ${domain}
    Difficulty Level: ${difficulty}
    Specific Topic: ${topic}

    Create 5 multiple-choice questions that are appropriate for ${difficulty} level students studying ${topic} in ${domain}.
    
    The questions should:
    - For beginner: Focus on basic concepts and definitions
    - For intermediate: Include application and understanding
    - For advanced: Incorporate analysis and problem-solving
    
    Format the response as a JSON array with this structure:
    [
      {
        "question": "The question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": 0, // index of correct option
        "explanation": "Brief explanation of the correct answer"
      }
    ]

    Provide only the JSON array without any additional text or formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Await the text here

    // Remove any markdown formatting
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();

    const parsedQuestions = JSON.parse(jsonString) as QuizQuestion[];

    // Validate the parsed questions
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length !== 5) {
      throw new Error("Invalid question count");
    }

    parsedQuestions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || 
          q.options.length !== 4 || typeof q.correctAnswer !== 'number' ||
          !q.explanation) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return parsedQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz: " + (error as Error).message);
  }
}