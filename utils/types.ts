export interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    children: RoadmapStep[];
}

export interface CareerRoadmap {
    career: string;
    steps: RoadmapStep[];
}

export interface LearningStep {
    id: string;
    title: string;
    description: string;
    children: LearningStep[];
}

export interface LearningPath {
    subject: string;
    steps: LearningStep[];
}