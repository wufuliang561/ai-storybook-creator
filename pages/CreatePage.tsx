
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ART_STYLES } from '../constants';
import { CreationOptions, Storybook } from '../types';
import { generateStorybook } from '../services/geminiService';
import { SparklesIcon } from '../components/icons/SparklesIcon';

interface CreatePageProps {
  addBookToShelf: (book: Storybook) => void;
}

const GenerationLoader: React.FC<{ messages: string[], activeIndex: number }> = ({ messages, activeIndex }) => (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="mt-6 text-lg text-brand-text-primary font-medium animate-pulse">{messages[activeIndex]}</p>
    </div>
);

export const CreatePage: React.FC<CreatePageProps> = ({ addBookToShelf }) => {
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storyPrompt, setStoryPrompt] = useState('');
  const [ageGroup, setAgeGroup] = useState(5);
  const [pageCount, setPageCount] = useState(10);
  const [style, setStyle] = useState(ART_STYLES[0]);
  const [customStyle, setCustomStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCharacterImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const isFormValid = characterImage && storyPrompt && (style !== 'Custom' || customStyle);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    const loadingMessages = [
        "Warming up the magic ink...",
        "Dreaming up a wonderful story...",
        "Painting vibrant illustrations...",
        "Binding the pages together...",
    ];

    const messageInterval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    const finalStyle = style === 'Custom' ? customStyle : style;
    const options: CreationOptions = {
      characterImage,
      storyPrompt,
      ageGroup,
      pageCount,
      style: finalStyle
    };
    
    try {
        const newBook = await generateStorybook(options);
        addBookToShelf(newBook);
        navigate('/bookshelf');
    } catch (error) {
        console.error("Failed to generate storybook:", error);
        alert("Oh no! Something went wrong while creating your story. Please try again.");
    } finally {
        clearInterval(messageInterval);
        setIsLoading(false);
    }
  }, [isFormValid, characterImage, storyPrompt, ageGroup, pageCount, style, customStyle, addBookToShelf, navigate]);

  return (
    <div className="container mx-auto px-6 pt-28 pb-16 animate-fade-in">
      {isLoading && <GenerationLoader messages={[
        "Warming up the magic ink...",
        "Dreaming up a wonderful story...",
        "Painting vibrant illustrations...",
        "Binding the pages together...",
    ]} activeIndex={loadingMessageIndex} />}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2 text-center">Create Your Storybook</h1>
        <p className="text-brand-text-secondary text-center mb-10">Fill in the details below and let our AI work its magic.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Image Upload */}
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border h-full">
              <h2 className="font-semibold text-brand-text-primary mb-3 text-lg">1. The Main Character</h2>
              <div className="aspect-w-1 aspect-h-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Character preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="p-4">
                    <p className="text-brand-text-secondary">Upload a photo of your hero</p>
                  </div>
                )}
              </div>
              <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <label htmlFor="file-upload" className="mt-4 w-full block text-center bg-white hover:bg-slate-50 text-brand-text-primary font-medium py-2 px-4 rounded-lg border border-slate-300 cursor-pointer transition-colors">
                {previewUrl ? 'Change Photo' : 'Upload Photo'}
              </label>
            </div>

            {/* Right Column: Story Details */}
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border h-full">
              <h2 className="font-semibold text-brand-text-primary mb-3 text-lg">2. Story Details</h2>
              <div className="space-y-4">
                <textarea
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  placeholder="e.g., A story about a brave astronaut exploring a planet made of candy."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-shadow"
                  rows={4}
                />
                <div>
                  <label className="block text-sm font-medium text-brand-text-secondary mb-1">Age Group: {ageGroup} years</label>
                  <input type="range" min="3" max="8" value={ageGroup} onChange={(e) => setAgeGroup(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-brand-text-secondary mb-1">Pages: {pageCount}</label>
                  <input type="range" min="5" max="15" value={pageCount} onChange={(e) => setPageCount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Art Style */}
          <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border">
             <h2 className="font-semibold text-brand-text-primary mb-4 text-lg">3. Art Style</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ART_STYLES.map(s => (
                  <button type="button" key={s} onClick={() => setStyle(s)} className={`p-3 text-center rounded-lg border-2 transition-all ${style === s ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    {s}
                  </button>
                ))}
                 <button type="button" onClick={() => setStyle('Custom')} className={`p-3 text-center rounded-lg border-2 transition-all ${style === 'Custom' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    Custom
                  </button>
             </div>
             {style === 'Custom' && (
              <input 
                type="text"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                placeholder="e.g., In the style of a vintage comic book"
                className="mt-4 w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-shadow"
              />
             )}
          </div>
          
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-10 py-4 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
            >
              <SparklesIcon className="w-6 h-6" />
              {isLoading ? 'Creating Magic...' : 'Generate My Storybook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
