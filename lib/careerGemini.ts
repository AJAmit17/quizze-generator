import { GoogleGenerativeAI } from "@google/generative-ai";

// console.log('Generating roadmap for career:', career);
console.log('API Key:', process.env.GOOGLE_API_KEY);

export async function generateCareerGuidance(jobTitle: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert career advisor. Provide a structured response for the job title "${jobTitle}" in the following JSON format:
        
        {
            "steps": ["Step 1", "Step 2", "Step 3"],
            "skills": ["Skill 1", "Skill 2", "Skill 3"],
            "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
        }

        Ensure that the JSON format is strictly followed without any additional text, markdown formatting, or code blocks. If you cannot provide the exact format, return an error message.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Raw Gemini output:", text);

        // Remove any extraneous markdown formatting and ensure it's a valid JSON string
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();

        // Attempt to parse the JSON
        const parsedGuidance = JSON.parse(jsonString);

        console.log("Parsed guidance:", parsedGuidance);

        // Validate the structure of the parsed guidance
        if (!parsedGuidance.steps || !parsedGuidance.skills || !parsedGuidance.challenges) {
            throw new Error("Invalid guidance format");
        }

        // Format the guidance as a readable string
        const guidance = `
            Steps to Advance: ${parsedGuidance.steps.join(', ')}\n
            Required Skills: ${parsedGuidance.skills.join(', ')}\n
            Potential Challenges: ${parsedGuidance.challenges.join(', ')}`;

        return guidance;
    } catch (error) {
        console.error("Error generating career guidance:", error);
        throw new Error("Failed to generate valid career guidance: " + (error as Error).message);
    }
}
