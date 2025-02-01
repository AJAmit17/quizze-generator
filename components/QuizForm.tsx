import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuizFormData } from '@/types';

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ jobTitle, skills, jobDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Skills (comma-separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        required
      />
      <Textarea
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Quiz'}
      </Button>
    </form>
  );
}