import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from '@/types';
import { z } from "zod";
import { roleSchema } from "./utils";

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const pathResponseSchema = z.object({
  paths: z.array(z.object({
    title: z.string(),
    steps: z.array(z.string()),
  })).length(4),
});

const guidanceResponseSchema = z.object({
  guidance: z.string(),
  roadmap: z.array(z.string()),
  learningPath: z.array(z.string()),
});

const genAI = new GoogleGenerativeAI("AIzaSyDyKBCF2BDeFRCshXpiJMOkh1Pc6zPL6Vc");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz(
  domain: string,
  difficulty: DifficultyLevel,
  topic: string
): Promise<QuizQuestion[]> {
  console.log("generateQuiz params:", { domain, difficulty, topic });
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
    const text = await response.text();
    console.log("Quiz result:", text);

    // Remove any markdown formatting
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();

    const parsedQuestions = JSON.parse(jsonString) as QuizQuestion[];
    console.log("Parsed questions:", parsedQuestions);

    // Validate the parsed questions
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length !== 5) {
      console.error("Invalid question count");
    }

    parsedQuestions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || 
          q.options.length !== 4 || typeof q.correctAnswer !== 'number' ||
          !q.explanation) {
        console.error(`Invalid question format at index ${index}`);
      }
    });

    return parsedQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
}

export async function generateRoles(field: string) {
  console.log("generateRoles param:", field);
  const prompt = `Generate 4-6 different professional roles within the field of ${field}. For each role, provide a title and brief description. Format the response as a JSON object with a "roles" array containing objects with "title" and "description" properties. Make the roles specific and relevant to the field, with clear and concise descriptions.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Ensure we await the text
    console.log("Roles result text:", text);
    const parsed = JSON.parse(text);
    console.log("Parsed roles:", parsed);
    // Return both parsed roles and raw output
    const parsedRoles = roleSchema.parse(parsed);
    return { ...parsedRoles, rawText: text };
  } catch (error) {
    console.error("Error generating roles:", error);
    return { roles: [], rawText: "" };
  }
}

export async function generateCareerPaths(role: string, field: string) {
  console.log("generateCareerPaths params:", { role, field });
  const prompt = `Generate 4 different career paths for a ${role} in ${field}. Each path should be unique and include 5 learning steps. Format the response as a JSON object with a "paths" array containing objects with "title" and "steps" properties. The titles should be creative and reflect the specialization. The steps should be concrete and actionable.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Ensure we await the text
    console.log("Career paths result text:", text);
    const parsed = JSON.parse(text);
    console.log("Parsed paths:", parsed);
    return pathResponseSchema.parse(parsed);
  } catch (error) {
    console.error("Error generating career paths:", error);
    return { paths: [] };
  }
}

export async function generateGuidance(role: string, field: string, experience: string) {
  console.log("generateGuidance params:", { role, field, experience });
  const prompt = `Generate short career guidance, a 5-point roadmap, and a 5-point learning path for someone with ${experience} experience as a ${role} in ${field}. Format your response as JSON with "guidance", "roadmap", and "learningPath".`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Ensure we await the text
    console.log("Guidance result text:", text);
    const parsed = JSON.parse(text);
    console.log("Parsed guidance:", parsed);
    return guidanceResponseSchema.parse(parsed);
  } catch (error) {
    console.error("Error generating guidance:", error);
    return {
      guidance: "",
      roadmap: [],
      learningPath: []
    };
  }
}