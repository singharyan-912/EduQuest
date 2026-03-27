import { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

export function Leaderboard() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('xp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      setLeaderboard(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={28} />;
      case 2:
        return <Medal className="text-gray-400" size={28} />;
      case 3:
        return <Award className="text-orange-500" size={28} />;
      default:
        return <span className="text-2xl font-bold text-gray-600">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-6 rounded-full">
              <Trophy className="text-yellow-600" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-xl text-gray-600">Top learners across all classes</p>
        </div>

        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === profile?.id;

            return (
              <Card
                key={user.id}
                className={isCurrentUser ? 'ring-2 ring-blue-500' : ''}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-14 h-14 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {user.full_name}
                        </h3>
                        {isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Class {user.class} • Level {user.level}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{user.xp}</p>
                      <p className="text-xs text-gray-500">XP</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No users on the leaderboard yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
