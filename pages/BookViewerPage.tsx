import React, { useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { Storybook } from '../types';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import './BookViewerPage.css';

interface BookViewerPageProps {
  books: Storybook[];
}

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; pageType?: string }>((props, ref) => {
  return (
    <div ref={ref} className="page-content bg-white h-full w-full shadow-lg" data-page-type={props.pageType}>
      {props.children}
    </div>
  );
});

Page.displayName = 'Page';

export const BookViewerPage: React.FC<BookViewerPageProps> = ({ books }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookRef = useRef<any>(null);
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return (
      <div className="container mx-auto px-6 pt-28 pb-16 text-center">
        <h1 className="text-3xl font-bold text-brand-text-primary mb-4">Book Not Found</h1>
        <p className="text-brand-text-secondary mb-6">Sorry, we couldn't find the book you're looking for.</p>
        <Link to="/bookshelf" className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-full">
          Back to Bookshelf
        </Link>
      </div>
    );
  }

  const flipNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const flipPrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = useCallback((e: any) => {
    console.log('Current page:', e.data);
  }, []);

  // Build pages array with proper pairing
  const allPages = [];
  
  // Front cover (single page on right)
  allPages.push(
    <Page key="cover" pageType="cover">
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <img 
          src={book.coverImageUrl} 
          alt={book.title}
          className="w-auto h-[70%] object-contain rounded-lg shadow-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-purple-800 mb-2">{book.title}</h2>
        <div className="flex items-center gap-2 text-purple-600">
          <BookOpenIcon className="w-5 h-5" />
          <span className="text-sm">A Magical Story</span>
        </div>
      </div>
    </Page>
  );

  // Title page
  allPages.push(
    <Page key="title" pageType="title">
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">{book.title}</h1>
        <p className="text-lg text-gray-600 mb-4">An AI-Generated Adventure</p>
        <div className="mt-auto">
          <p className="text-sm text-gray-500">Created with AI Storybook Creator</p>
        </div>
      </div>
    </Page>
  );

  // Story pages - each story page becomes two book pages (image left, text right)
  book.pages.forEach((page, index) => {
    // Image page (left side when book is open)
    allPages.push(
      <Page key={`img-${page.pageNumber}`} pageType="image">
        <div className="flex items-center justify-center h-full p-4">
          <img 
            src={page.imageUrl} 
            alt={`Page ${page.pageNumber}`}
            className="w-auto h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </Page>
    );
    
    // Text page (right side when book is open)
    allPages.push(
      <Page key={`text-${page.pageNumber}`} pageType="text">
        <div className="flex flex-col justify-center h-full p-12">
          <p className="text-lg leading-relaxed text-gray-800 font-serif">
            {page.text}
          </p>
          <p className="text-sm text-gray-400 text-center mt-8">Page {page.pageNumber}</p>
        </div>
      </Page>
    );
  });

  // If we have an odd number of pages, add a blank page
  if (allPages.length % 2 !== 0) {
    allPages.push(
      <Page key="blank" pageType="blank">
        <div className="h-full"></div>
      </Page>
    );
  }

  // Back cover
  allPages.push(
    <Page key="back-cover" pageType="back-cover">
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">The End</h2>
        <p className="text-lg text-gray-600 mb-8">Thank you for reading!</p>
        <Link 
          to="/create"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Create Your Own Story
        </Link>
      </div>
    </Page>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/bookshelf" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
            ← Back to Bookshelf
          </Link>
          <h1 className="text-2xl font-bold text-brand-text-primary">{book.title}</h1>
          <div className="w-32"></div>
        </div>

        <div className="flex justify-center items-center">
          <button 
            onClick={flipPrev}
            className="mr-8 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Previous page"
          >
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="book-container" style={{ width: '800px', height: '533px' }}>
            <HTMLFlipBook
              width={400}
              height={533}
              size="fixed"
              minWidth={300}
              maxWidth={400}
              minHeight={400}
              maxHeight={533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={false}
              className="demo-book"
              ref={bookRef}
              onFlip={onFlip}
              flippingTime={1000}
              usePortrait={false}
              startPage={0}
              startZIndex={0}
              autoSize={false}
              drawShadow={true}
              useMouseEvents={true}
              swipeDistance={30}
              clickEventForward={false}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {allPages}
            </HTMLFlipBook>
          </div>

          <button 
            onClick={flipNext}
            className="ml-8 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Next page"
          >
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Click on the book corners or use the arrow buttons to turn pages</p>
        </div>
      </div>
    </div>
  );
};