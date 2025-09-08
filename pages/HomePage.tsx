
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_STORYBOOKS } from '../constants';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border text-center transform hover:-translate-y-1 transition-transform duration-300">
    <div className="inline-block bg-brand-accent-start/30 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">{title}</h3>
    <p className="text-brand-text-secondary text-sm">{description}</p>
  </div>
);


export const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-32 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-text-primary mb-4 leading-tight">
            Create Magical Storybooks <br /> with AI
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-brand-text-secondary mb-8">
            Turn your child into the hero of their own tale. Upload a photo, share a story idea, and watch as AI brings a personalized, beautifully illustrated book to life.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <SparklesIcon className="w-6 h-6" />
            Start Creating
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-12">How It Works in 3 Simple Steps</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<div className="text-xl">🎨</div>}
            title="1. Describe Your Hero & Story"
            description="Upload a photo of your main character and write a simple prompt for the story you want to create."
          />
          <FeatureCard 
            icon={<SparklesIcon className="w-6 h-6 text-purple-600"/>}
            title="2. Customize & Generate"
            description="Choose the art style, age group, and length. Our AI will then write the story and create unique illustrations."
          />
          <FeatureCard 
            icon={<div className="text-xl">📖</div>}
            title="3. Read & Cherish"
            description="Receive a complete digital storybook to read with your child, ready to be cherished for years to come."
          />
        </div>
      </section>

      {/* Showcase Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-12">Inspiring Adventures</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {MOCK_STORYBOOKS.map((book, index) => (
            <div key={book.id} className={`group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ${index > 1 ? 'hidden md:block' : ''}`}>
              <img src={book.coverImageUrl} alt={book.title} className="w-full h-auto object-cover aspect-[3/4] transform group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
