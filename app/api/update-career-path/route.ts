// app/api/update-career-path/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, careerPath } = await req.json();

  try {
    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, create the user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          careerPath,
        },
      });
    } else {
      // Update the career path if the user exists
      user = await prisma.user.update({
        where: { email },
        data: { careerPath },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating career path:', error);
    return NextResponse.json({ error: 'Failed to update career path' }, { status: 500 });
  }
}