import { Trophy, BarChart3, Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: any) => void;
  currentPage: any;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate(profile ? 'dashboard' : 'home')}
              className="text-2xl font-bold text-blue-600"
            >
              EduQuest
            </button>

            {(profile || user) && (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => onNavigate('leaderboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'leaderboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Trophy size={20} />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => onNavigate('progress')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 size={20} />
                  <span>Progress</span>
                </button>
              </div>
            )}
          </div>

          {(profile || user) && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {profile?.full_name || user?.email}
                </p>
                {profile && (
                  <div className="flex items-center justify-end space-x-2 text-xs">
                    <span className="text-gray-600">Level {profile.level}</span>
                    <span className="text-blue-600 font-bold">{profile.xp} XP</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
