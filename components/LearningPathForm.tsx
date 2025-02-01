"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LearningPath } from '@/utils/types';
import { generateLearningPath } from '@/utils/gemini';

const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
});

interface LearningPathFormProps {
  setLearningPath: (learningPath: LearningPath) => void;
}

export function LearningPathForm({ setLearningPath }: LearningPathFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    setIsLoading(true);
    setError(null);
    try {
      console.log('Calling generateLearningPath...');
      const learningPath = await generateLearningPath(values.subject);
      console.log('Learning path generated:', learningPath);
      setLearningPath(learningPath);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setError('Failed to generate learning path. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Machine Learning" {...field} />
              </FormControl>
              <FormDescription>
                Enter the subject you want to generate a learning path for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Learning Path'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
}