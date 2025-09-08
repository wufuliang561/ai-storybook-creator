
import React from 'react';
import { Link } from 'react-router-dom';
import { Storybook } from '../types';

interface BookshelfPageProps {
  books: Storybook[];
}

export const BookshelfPage: React.FC<BookshelfPageProps> = ({ books }) => {
  return (
    <div className="container mx-auto px-6 pt-28 pb-16 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2 text-center">My Bookshelf</h1>
        <p className="text-brand-text-secondary text-center mb-10">All the magical stories you've created.</p>

        {books.length === 0 ? (
          <div className="text-center bg-brand-surface border border-brand-border rounded-3xl p-12">
            <p className="text-xl font-medium text-brand-text-primary mb-4">Your bookshelf is empty!</p>
            <p className="text-brand-text-secondary mb-6">It's time to create your first magical story.</p>
            <Link
              to="/create"
              className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Create a New Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-auto object-cover aspect-[3/4]" />
                </div>
                <h3 className="text-md font-semibold text-brand-text-primary mt-3 truncate group-hover:text-purple-600">{book.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
