import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import RegistrationMenu from './components/RegistrationMenu';
import StudentRegistration from './components/StudentRegistration';
import GeneralRegistration from './components/GeneralRegistration';
import InfoPage from './components/InfoPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminMainPage from './components/admin/AdminMainPage';

export type NavigationState = 'landing' | 'info' | 'registration-menu' | 'student-registration' | 'general-registration' | 'home' | 'login' | 'main' | 'admin-login' | 'admin-main';

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationState>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'info':
        return <InfoPage onNavigate={setCurrentPage} />;
      case 'registration-menu':
        return <RegistrationMenu onNavigate={setCurrentPage} />;
      case 'student-registration':
        return <StudentRegistration onNavigate={setCurrentPage} />;
      case 'general-registration':
        return <GeneralRegistration onNavigate={setCurrentPage} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={setIsLoggedIn} />;
      case 'main':
        return <MainPage onNavigate={setCurrentPage} onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage('landing');
        }} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={setCurrentPage} onLogin={setIsAdminLoggedIn} />;
      case 'admin-main':
        return <AdminMainPage onNavigate={setCurrentPage} onLogout={() => {
          setIsAdminLoggedIn(false);
          setCurrentPage('landing');
        }} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;