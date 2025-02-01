import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { QuizFormData } from '@/types';

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ domain, difficulty, topic });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Domain</label>
        <Input
          placeholder="Enter domain (e.g., Computer Science, Mathematics)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Difficulty Level</label>
        <Select
          value={difficulty}
          onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Topic</label>
        <Input
          placeholder="Enter specific topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
      </Button>
    </form>
  );
}