// app/api/career-guidance/route.ts

import { generateCareerGuidance } from '@/lib/careerGemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { jobTitle } = await req.json();

    try {
        const guidance = await generateCareerGuidance(jobTitle);
        return NextResponse.json({ guidance });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get career guidance' }, { status: 500 });
    }
}