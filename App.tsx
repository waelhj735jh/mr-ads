import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { HomePage, LoginPage, DashboardPage, PostAdPage, AdDetailsPage, AboutPage, ContactPage, FaqPage } from './PageComponents';
import { Spinner } from './UIComponents';
import { getCurrentUser, loginUser, signupUser, logoutUser } from '../services/database';
import type { Page, User, NavigationContextType, UserWithPassword } from '../types';

const NavigationContext = React.createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

function App(): React.ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>({ name: 'home' });

  useEffect(() => {
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (credentials: Omit<UserWithPassword, 'password_confirm'>) => {
    try {
      const loggedInUser = loginUser(credentials);
      setUser(loggedInUser);
      navigate({ name: 'home' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = (credentials: UserWithPassword) => {
    try {
      const newUser = signupUser(credentials);
      setUser(newUser);
      navigate({ name: 'home' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate({ name: 'login' });
  };
  
  const navigate = useCallback((page: Page) => {
    window.scrollTo(0, 0);
    setPage(page);
  }, []);

  const renderPage = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
    }
    switch (page.name) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage user={user} />;
      case 'post_ad':
        return <PostAdPage user={user} />;
      case 'edit_ad':
        return <PostAdPage user={user} adId={page.adId} />;
      case 'ad_details':
        return <AdDetailsPage adId={page.adId} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      default:
        return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <NavigationContext.Provider value={{ page, navigate }}>
      <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
}

export default App;