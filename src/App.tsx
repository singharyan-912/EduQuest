import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Loading } from './components/ui/Loading';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { SubjectPage } from './pages/SubjectPage';
import { ChapterPage } from './pages/ChapterPage';
import { Leaderboard } from './pages/Leaderboard';
import { Progress } from './pages/Progress';
import { ParentDashboard } from './pages/ParentDashboard';

type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'subject'
  | 'chapter'
  | 'leaderboard'
  | 'progress'
  | 'parent-dashboard';

interface NavigationState {
  page: Page;
  data?: {
    subjectId?: string;
    subjectName?: string;
    chapterId?: string;
    chapterName?: string;
  };
  history: { page: Page; data?: NavigationState['data'] }[];
}

function AppContent() {
  const { isParentView, user, loading } = useAuth();
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'home',
    history: [],
  });

  const handleNavigate = (page: Page, data?: NavigationState['data']) => {
    setNavigation((prev) => ({
      page,
      data,
      history: [...prev.history, { page: prev.page, data: prev.data }],
    }));
  };

  const handleBack = () => {
    setNavigation((prev) => {
      const newHistory = [...prev.history];
      const previous = newHistory.pop();
      return {
        page: previous?.page || 'dashboard',
        data: previous?.data,
        history: newHistory,
      };
    });
  };

  if (loading) {
    return <Loading />;
  }

  const showNavbar = user && navigation.page !== 'login' && navigation.page !== 'signup' && !isParentView;

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar onNavigate={handleNavigate} currentPage={navigation.page} />}

      {!user && (
        <>
          {navigation.page === 'home' && <Home onNavigate={handleNavigate} />}
          {navigation.page === 'login' && <Login onNavigate={handleNavigate} />}
          {navigation.page === 'signup' && <Signup onNavigate={handleNavigate} />}
        </>
      )}

      {user && (
        <>
          {(navigation.page === 'dashboard' || navigation.page === 'home') && (
            <Dashboard onNavigate={handleNavigate} />
          )}
          {navigation.page === 'subject' && navigation.data?.subjectId && (
            <SubjectPage
              subjectId={navigation.data.subjectId}
              subjectName={navigation.data.subjectName || ''}
              onNavigate={handleNavigate}
              onBack={handleBack}
            />
          )}
          {navigation.page === 'chapter' && navigation.data?.chapterId && (
            <ChapterPage
              chapterId={navigation.data.chapterId}
              chapterName={navigation.data.chapterName || ''}
              subjectName={navigation.data.subjectName || ''}
              onBack={handleBack}
            />
          )}
          {navigation.page === 'leaderboard' && <Leaderboard />}
          {navigation.page === 'progress' && <Progress />}
          {navigation.page === 'parent-dashboard' && <ParentDashboard onNavigate={handleNavigate} />}
          {navigation.page === 'login' && <Login onNavigate={handleNavigate} />}
          {navigation.page === 'signup' && <Signup onNavigate={handleNavigate} />}
        </>
      )}

      {!user &&
        navigation.page !== 'home' &&
        navigation.page !== 'login' &&
        navigation.page !== 'signup' && <Home onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
