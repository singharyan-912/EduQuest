import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

interface SignupProps {
  onNavigate: (page: any) => void;
}

export function Signup({ onNavigate }: SignupProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState<'10' | '12'>('10');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName, selectedClass);
      onNavigate('dashboard');
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to create account.';

      if (/already registered|already in use|user already registered/i.test(message)) {
        setError('This email is already registered. Try logging in or use a different email.');
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">EduQuest</h1>
          <p className="text-gray-600">Start your gamified learning adventure</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              type="button"
              className="flex-1 pb-2 text-center font-semibold text-blue-600 border-b-2 border-blue-600"
            >
              Signup (New Student)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="flex-1 pb-2 text-center font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              Login (Existing Student)
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedClass('10')}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    selectedClass === '10'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Class 10
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClass('12')}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    selectedClass === '12'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Class 12
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
