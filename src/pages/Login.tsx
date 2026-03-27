import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onNavigate: (page: any) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isParentLogin, setIsParentLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password, isParentLogin);
      onNavigate(isParentLogin ? 'parent-dashboard' : 'dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">EduQuest</h1>
          <p className="text-gray-600">Login to continue your learning journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="flex-1 pb-2 text-center font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              Signup
            </button>
            <button
              type="button"
              className="flex-1 pb-2 text-center font-semibold text-blue-600 border-b-2 border-blue-600"
            >
              Login
            </button>
          </div>

          <div className="flex bg-gray-100 p-1 mb-6 rounded-xl">
             <button
               type="button"
               onClick={() => setIsParentLogin(false)}
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                 !isParentLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Student Login
             </button>
             <button
               type="button"
               onClick={() => setIsParentLogin(true)}
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                 isParentLogin ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Parent Portal
             </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isParentLogin ? 'Monitor Child Progress' : 'Login with Email'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={isParentLogin ? "Student Email" : "Email"}
              type="email"
              placeholder={isParentLogin ? "Enter your child's registered email" : "Enter your registered email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                className={`w-full ${isParentLogin ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                disabled={loading}
            >
              {loading ? (isParentLogin ? 'Entering Portal...' : 'Logging in...') : (isParentLogin ? 'Login to Parent Portal' : 'Login')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
