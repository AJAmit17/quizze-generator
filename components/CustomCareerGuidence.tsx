"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { Separator } from '@radix-ui/react-dropdown-menu';

const CustomCareerGuidance: React.FC = () => {
    const { user } = useUser();
    const [jobTitle, setJobTitle] = useState<string>('');
    const [guidance, setGuidance] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/career-guidance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobTitle }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setGuidance(data.guidance);

            // Update career path in the database
            if (user) {
                const email = user.emailAddresses[0].emailAddress;
                const response = await fetch('/api/update-career-path', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, careerPath: jobTitle }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                }
            }
        } catch (error) {
            console.error('Failed to get career guidance:', error);
        }
    };

    const formatGuidance = (guidance: string) => {
        const sections = guidance.split('\n');
        const formattedSections = sections.map((section, index) => {
            const [title, ...items] = section.split(', ');
            return (
                <div key={index} className="mt-4">
                    <h3 className="text-xl font-semibold">{title.replace(/:/g, '')}</h3>
                    <ul className="list-disc list-inside ml-4">
                        {items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        });
        return formattedSections;
    };

    return (
        <Card className="max-w-xl mx-auto p-6 mt-8">
            <CardHeader>
                <CardTitle>Custom Career Guidance</CardTitle>
                <CardDescription>Get personalized career guidance based on your desired job title.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                            id="jobTitle"
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Enter job title"
                        />
                    </div>
                    <Button type="submit" className="w-full">Get Guidance</Button>
                </form>
                {guidance && (
                    <div className="mt-8">
                        <Separator />
                        <h2 className="text-2xl font-semibold mt-4">Career Guidance</h2>
                        {formatGuidance(guidance)}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CustomCareerGuidance;
