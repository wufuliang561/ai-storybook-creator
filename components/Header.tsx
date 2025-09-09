
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoginModal } from './LoginModal';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onNavigate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const linkClass = "flex items-center gap-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200 px-4 py-2 rounded-lg";
  const activeLinkClass = "bg-white shadow-sm text-brand-text-primary";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-2" onClick={onNavigate}>
            <SparklesIcon className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold text-brand-text-primary">Storybook AI</span>
          </NavLink>
          
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl border border-brand-border">
              <NavLink
                to="/create"
                className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
                onClick={onNavigate}
              >
                <PlusIcon className="w-5 h-5" />
                Create
              </NavLink>
              <NavLink
                to="/bookshelf"
                className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
                onClick={onNavigate}
              >
                <BookOpenIcon className="w-5 h-5" />
                My Bookshelf
              </NavLink>
            </nav>
            
            {user ? (
              <div className="flex items-center gap-3">
                <img 
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`} 
                  alt={user.user_metadata?.full_name || user.email}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
                <span className="text-sm font-medium text-brand-text-primary hidden sm:block">
                  {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent"></div>
      </header>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};
