
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-bg py-8 mt-16">
      <div className="container mx-auto px-6 text-center text-brand-text-secondary">
        <p>&copy; {new Date().getFullYear()} Storybook AI. All rights reserved.</p>
        <p className="mt-2 text-sm">Crafted with ❤️ and AI.</p>
      </div>
    </footer>
  );
};
