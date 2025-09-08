
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
    onNavigate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const linkClass = "flex items-center gap-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200 px-4 py-2 rounded-lg";
  const activeLinkClass = "bg-white shadow-sm text-brand-text-primary";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <SparklesIcon className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold text-brand-text-primary">Storybook AI</span>
        </NavLink>
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
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent"></div>
    </header>
  );
};
