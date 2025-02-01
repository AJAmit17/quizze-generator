import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateQuiz(jobTitle: string, skills: string, jobDescription: string): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a quiz for a ${jobTitle} position with the following skills: ${skills}. Job description: ${jobDescription}. Generate 5 multiple-choice questions related to the job and skills. Format the response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), and 'correctAnswer' (index of correct option) properties. Provide only the JSON array without any additional text, markdown formatting, or code blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini output:", text);

    // Remove any potential markdown formatting
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();

    console.log("Cleaned JSON string:", jsonString);

    // Attempt to parse the JSON
    const parsedQuestions = JSON.parse(jsonString) as QuizQuestion[];

    console.log("Parsed questions:", parsedQuestions);

    // Validate the structure of the parsed questions
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length !== 5) {
      throw new Error("Invalid question format or count");
    }

    parsedQuestions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return parsedQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error. Raw output:");
    }
    throw new Error("Failed to generate valid quiz questions: " + (error as Error).message);
  }
}