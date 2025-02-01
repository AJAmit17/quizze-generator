// app/api/career/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Helper function to clean and parse JSON from AI response
const cleanAndParseJSON = (text: string) => {
  // Remove markdown code block syntax
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // Parse the cleaned JSON
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Cleaned text was:', cleaned);
    throw new Error('Invalid JSON response from AI');
  }
};

export async function POST(req: Request) {
  try {
    const { action, field, role, experience } = await req.json();

    switch (action) {
      case 'roles':
        return await generateRoles(field);
      case 'paths':
        return await generatePaths(role, field);
      case 'guidance':
        return await generateGuidance(role, field, experience);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

async function generateRoles(field: string) {
  const prompt = `Generate 4-6 different professional roles within the field of ${field}. 
    Return ONLY a JSON object with this exact structure (no markdown, no explanation):
    {
      "roles": [
        {
          "title": "Role Title",
          "description": "Role Description"
        }
      ]
    }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return NextResponse.json(cleanAndParseJSON(text));
}

async function generatePaths(role: string, field: string) {
  const prompt = `Generate 4 different career paths for a ${role} in ${field}. 
    Return ONLY a JSON object with this exact structure (no markdown, no explanation):
    {
      "paths": [
        {
          "title": "Path Title",
          "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
        }
      ]
    }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return NextResponse.json(cleanAndParseJSON(text));
}

async function generateGuidance(role: string, field: string, experience: string) {
  const prompt = `Generate career guidance for a ${role} in ${field} with ${experience} experience.
    Return ONLY a JSON object with this exact structure (no markdown, no explanation):
    {
      "guidance": "Guidance text here",
      "roadmap": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "learningPath": ["Learning 1", "Learning 2", "Learning 3", "Learning 4", "Learning 5"]
    }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return NextResponse.json(cleanAndParseJSON(text));
}