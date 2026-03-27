import { BookOpen, Trophy, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onNavigate: (page: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">EduQuest</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your NCERT learning experience into an exciting adventure. Earn XP, level up,
            and compete with fellow students while mastering Class 10 and Class 12 subjects.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')}>
              Login
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Learn through engaging content based on NCERT syllabus for Class 10 and 12.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Earn Rewards</h3>
            <p className="text-gray-600">
              Complete chapters and challenges to earn XP and level up your profile.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning progress across all subjects with detailed analytics.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Compete & Learn</h3>
            <p className="text-gray-600">
              Challenge yourself and climb the leaderboard to become a top learner.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Begin Your Quest?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are making learning fun and effective with EduQuest.
            Choose your class and start your learning adventure today.
          </p>
          <Button size="lg" onClick={() => onNavigate('signup')}>
            Start Learning Now
          </Button>
        </div>
      </div>
    </div>
  );
}
