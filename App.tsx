
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { BookshelfPage } from './pages/BookshelfPage';
import { Storybook } from './types';
import { MOCK_STORYBOOKS } from './constants';

const AppContent: React.FC = () => {
  const [books, setBooks] = useState<Storybook[]>(MOCK_STORYBOOKS.slice(0,2)); // Start with some initial books for demo
  const location = useLocation();

  const addBookToShelf = (newBook: Storybook) => {
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };
  
  const handleNavigate = () => {
    window.scrollTo(0, 0);
  }

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text-primary font-sans">
      <Header onNavigate={handleNavigate} />
      <main className="min-h-[calc(100vh-100px)]">
         <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage addBookToShelf={addBookToShelf} />} />
            <Route path="/bookshelf" element={<BookshelfPage books={books} />} />
          </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
