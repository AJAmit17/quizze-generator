import Link from "next/link"
import { routes } from "@/constants/routes"
import { UserButton } from "@clerk/nextjs"
import { HomeIcon, BookOpen, Compass, MapPin, Brain, Sparkles } from "lucide-react"

export function MainNav() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href={routes.dashboard} className="flex items-center space-x-2">
            <HomeIcon className="h-5 w-5" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          <Link href={routes.career} className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Career</span>
          </Link>
          <Link href={routes.careerRoadmap} className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Roadmap</span>
          </Link>
          <Link href={routes.learningPath} className="flex items-center space-x-2">
            <Compass className="h-4 w-4" />
            <span>Learning</span>
          </Link>
          <Link href={routes.quiz} className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Quiz</span>
          </Link>
          <Link href={routes.generate} className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Generate</span>
          </Link>
          <UserButton afterSignOutUrl={routes.auth.signIn} />
        </div>
      </div>
    </nav>
  )
}
