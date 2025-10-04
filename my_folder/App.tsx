import React from 'react';
import { LogIn } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SimpleAdminDashboard from './pages/SimpleAdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

const AppRoutes: React.FC = () => {
  const { state } = useApp();

  const renderCurrentView = () => {
    // Debug: Log current state
    console.log('Current view:', state.currentView);
    console.log('Current user:', state.currentUser);
    console.log('Company:', state.company);
    
    switch (state.currentView) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'admin':
        return state.currentUser ? <SimpleAdminDashboard /> : <div className="p-8 text-center">Loading Admin Dashboard...</div>;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <HomePage />;
    }
  };

  return renderCurrentView();
};

const HomePage: React.FC = () => {
  const { dispatch, registerAdmin } = useApp();

  const testAdminRegistration = async () => {
    await registerAdmin({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      companyName: 'Test Company',
      country: 'IN'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/95/f8/61/95f86170f93a8466f628d9a435b80ee8.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-slate-900/80 to-teal-900/70"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full px-8 py-8">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-widest" style={{ fontFamily: 'monospace, -apple-system, lucida console', letterSpacing: '0.1em' }}>
              EXPENSE MANAGEMENT
            </h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pt-4 space-y-4">
              <button
                className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-emerald-500/50 text-lg"
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'login' })}
              >
                <LogIn className="w-6 h-6 group-hover:rotate-6 transition-transform" />
                <span>Login / Register</span>
              </button>
              
              <button
                className="group inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-blue-500/50 text-sm"
                onClick={testAdminRegistration}
              >
                <span>🚀 Test Admin Registration</span>
              </button>
            </div>
          </div>
        </main>

        <footer className="w-full px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 mb-6 text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                About Us
              </h2>
              <div className="space-y-4 text-sm md:text-base text-white/85 leading-relaxed max-w-4xl mx-auto text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <p className="font-light">
                  We empower you to take control of your finances with intelligent expense tracking and insightful analytics. Our platform simplifies money management, helping you save more and spend wisely every day.
                </p>
                <p className="font-light">
                  Join thousands who trust us to manage their expenses and achieve their financial goals.
                </p>
              </div>
            </div>
            <div className="text-center text-white/50 text-sm mt-6">
              <p>&copy; 2025 Expense Manager. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AppRoutes />
      </div>
    </AppProvider>
  );
};

export default App;