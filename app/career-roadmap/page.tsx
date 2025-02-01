"use client";

import { useState } from 'react';
import { CareerForm } from '@/components/CareerForm';
import { RoadmapChart } from '@/components/RoadmapChart';
import { CareerRoadmap } from '@/utils/types';

export default function CareerRoadmapPage() {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI-Powered Career Roadmap Generator</h1>
      <CareerForm setRoadmap={setRoadmap} />
      {roadmap && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Career Roadmap for {roadmap.career}</h2>
          <p className="mb-4">Click on a node to view more details about each step in your career path.</p>
          <RoadmapChart roadmap={roadmap} />
        </div>
      )}
    </div>
  );
}