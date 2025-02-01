"use client";

import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CareerRoadmap } from '@/utils/types';
import { generateRoadmap } from '@/utils/gemini';


const formSchema = z.object({
  career: z.string().min(2, {
    message: "Career must be at least 2 characters.",
  }),
});

interface CareerFormProps {
  setRoadmap: (roadmap: CareerRoadmap) => void;
}

export function CareerForm({ setRoadmap }: CareerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      career: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    setIsLoading(true);
    setError(null);
    try {
      console.log('Calling generateRoadmap...');
      const roadmap = await generateRoadmap(values.career);
      console.log('Roadmap generated:', roadmap);
      setRoadmap(roadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="career"
          render={({ field }: { field: ControllerRenderProps<{ career: string }, "career"> }) => (
            <FormItem>
              <FormLabel>Career</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormDescription>
                Enter the career you want to generate a roadmap for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Roadmap'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
}