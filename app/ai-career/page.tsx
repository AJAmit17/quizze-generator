/* eslint-disable @typescript-eslint/no-unused-vars */
// app/careers/page.tsx
"use client"

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Briefcase, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchRoles, fetchPaths, fetchGuidance } from '@/lib/api';
import { CareerRole, CareerPath, GuidanceData } from '@/types';
import { motion } from 'framer-motion';

export default function CareersPage() {
  const { toast } = useToast();
  const [field, setField] = useState('');
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null);
  const [experience, setExperience] = useState('');
  const [view, setView] = useState<'paths' | 'guidance'>('paths');
  const [loading, setLoading] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!field.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoles(field);
      setRoles(data.roles);
      setSelectedRole(null);
      setCareerPaths([]);
      setGuidance(null);
    } catch (error) {
      setError('Failed to fetch roles. Please try again.');
      toast({
        title: "Error",
        description: "Could not fetch roles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: CareerRole) => {
    setSelectedRole(role);
    setExperience('');
    setGuidance(null);
    setCareerPaths([]);
    setError(null);
  };

  const handleExperienceSubmit = async () => {
    if (!selectedRole || !experience.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (view === 'paths') {
        const data = await fetchPaths(selectedRole.title, field);
        setCareerPaths(data.paths);
        setGuidance(null);
      } else {
        const data = await fetchGuidance(selectedRole.title, field, experience);
        setGuidance(data);
        setCareerPaths([]);
      }
    } catch (error) {
      setError(`Failed to fetch ${view}. Please try again.`);
      toast({
        title: "Error",
        description: `Could not fetch ${view}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          className="text-center space-y-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">Career Path Explorer</h1>
          <p className="text-neutral-400">Discover personalized career paths and professional guidance</p>
        </motion.div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Field Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-800/50 border-neutral-700">
            <CardHeader>
              <h2 className="text-2xl font-bold">Enter Your Field</h2>
              <p className="text-sm text-neutral-400">What area would you like to explore?</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFieldSubmit} className="space-y-4">
                <Input
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="e.g., Data Science, Web Development, Marketing"
                  className="bg-neutral-900 border-neutral-700"
                />
                <Button
                  type="submit"
                  disabled={loading || !field.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Briefcase className="mr-2 h-4 w-4" />
                  )}
                  Explore Roles
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roles Selection */}
        {roles.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-neutral-800/50 border-neutral-700">
              <CardHeader>
                <h2 className="text-2xl font-bold">Available Roles</h2>
                <p className="text-sm text-neutral-400">Select a role to explore paths and guidance</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {roles.map((role) => (
                    <motion.div
                      key={role.title}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-colors hover:bg-neutral-700/70 ${selectedRole?.title === role.title ? 'bg-primary/20 border-primary' : 'bg-neutral-700/50'
                          }`}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <h3 className="font-semibold">{role.title}</h3>
                        <p className="text-sm text-neutral-400 mt-2">{role.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Experience Input */}
        {selectedRole && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-neutral-800/50 border-neutral-700">
              <CardHeader>
                <h2 className="text-2xl font-bold">Your Experience</h2>
                <p className="text-sm text-neutral-400">Tell us about your background in {selectedRole.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., Beginner, 2 years, Senior"
                  className="bg-neutral-900 border-neutral-700"
                />
                <Tabs value={view} onValueChange={setView} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paths">Career Paths</TabsTrigger>
                    <TabsTrigger value="guidance">Guidance & Learning</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  onClick={handleExperienceSubmit}
                  disabled={loading || !experience.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : view === 'paths' ? (
                    <GraduationCap className="mr-2 h-4 w-4" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  Get {view === 'paths' ? 'Career Paths' : 'Guidance'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Processing your request...</span>
          </div>
        )}

        {/* Career Paths View */}
        {!loading && view === 'paths' && careerPaths.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-neutral-800/50 border-neutral-700">
              <CardHeader>
                <h2 className="text-2xl font-bold">Career Paths</h2>
                <p className="text-sm text-neutral-400">Explore different career trajectories for {selectedRole?.title}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={careerPaths[0]?.title} className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    {careerPaths.map((path) => (
                      <TabsTrigger key={path.title} value={path.title}>
                        {path.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {careerPaths.map((path) => (
                    <TabsContent key={path.title} value={path.title}>
                      <div className="space-y-4">
                        {path.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-neutral-900/50 rounded-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <p className="text-sm">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Guidance View */}
        {!loading && view === 'guidance' && guidance && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-neutral-800/50 border-neutral-700">
              <CardHeader>
                <h2 className="text-2xl font-bold">Career Guidance</h2>
                <p className="text-sm text-neutral-400">Personalized advice and learning path</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="p-4 bg-neutral-900/50 rounded-lg"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-semibold mb-2">Personal Guidance</h3>
                  <p className="text-sm leading-relaxed">{guidance.guidance}</p>
                </motion.div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Career Roadmap</h3>
                  {guidance.roadmap.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-neutral-900/50 rounded-lg"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-sm">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Learning Path</h3>
                  {guidance.learningPath.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-neutral-900/50 rounded-lg"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <BookOpen className="flex-shrink-0 w-6 h-6 text-primary" />
                      <p className="text-sm">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}