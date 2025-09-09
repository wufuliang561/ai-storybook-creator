# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Storybook Creator - React-based web application that generates personalized children's storybooks using Google Gemini AI. Users upload a character image and provide story prompts, and the app generates illustrated storybooks with AI-generated text and images.

## Core Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7 (HashRouter for deployment)
- **Build Tool**: Vite
- **AI Service**: Google Gemini API (text generation + Imagen for images)
- **Styling**: Tailwind CSS (inline classes, no separate CSS files)
- **Book Reader**: react-pageflip library for realistic page-turning effects

### Key Components Structure

**App.tsx** - Main app container with HashRouter, manages books state, defines routes
**pages/CreatePage.tsx** - Story creation form and generation workflow with loading states
**pages/BookshelfPage.tsx** - Grid display of generated books with navigation to viewer
**pages/BookViewerPage.tsx** - Book reader with page-flip animation, left-text right-image layout
**services/geminiService.ts** - Gemini API integration with mock fallback for development
**types.ts** - Core TypeScript interfaces (Page, Storybook, CreationOptions)

### Data Flow
1. User uploads character image → stored as File object
2. Form submission → CreationOptions passed to geminiService
3. Gemini generates story JSON → pages with text and image prompts
4. Imagen generates illustrations → base64 encoded images
5. Storybook object created → added to app state
6. Navigation to bookshelf → displays generated book
7. Click book → opens BookViewerPage with flip animation

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (uses mock data if no API key)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Create `.env.local` file:
```
GEMINI_API_KEY=your_api_key_here
```

The Vite config exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` in the app.

## Critical Implementation Details

### Gemini Service Behavior
- **Development mode**: Uses mock generator with 8-second delay
- **Production mode**: Requires valid GEMINI_API_KEY
- **Fallback**: Automatically uses mock if API key missing
- **Model**: Uses gemini-2.5-flash for text, imagen-4.0-generate-001 for images

### Image Handling
- Character images converted to base64 for Gemini processing
- Generated images returned as base64 data URLs
- Cover images use 3:4 aspect ratio (portrait)
- Story images use 4:3 aspect ratio (landscape)

### Book Viewer Features
- **Page Layout**: Left page shows text, right page shows illustration
- **Cover Animation**: Cover centered initially, shifts left when opening
- **Page Numbers**: Displayed in bottom-right corner of text pages
- **Navigation**: Arrow buttons and click/drag for page turning
- **Responsive**: Uses HTMLFlipBook with fixed dimensions (400x533px per page)

### State Management
- Books array managed at App level, passed via props
- No external state management library
- Mock data from constants.ts includes 2 books with full 8-page stories
- BookViewer uses local state for current page tracking

### Path Aliases
- `@/` resolves to project root (configured in vite.config.ts and tsconfig.json)