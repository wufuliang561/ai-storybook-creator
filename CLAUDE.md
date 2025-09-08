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

### Key Components Structure

**App.tsx:8-31** - Main app container with HashRouter, manages books state
**pages/CreatePage.tsx:20-174** - Story creation form and generation workflow
**services/geminiService.ts:38-136** - Gemini API integration with mock fallback
**types.ts:2-21** - Core TypeScript interfaces (Page, Storybook, CreationOptions)

### Data Flow
1. User uploads character image → stored as File object
2. Form submission → CreationOptions passed to geminiService
3. Gemini generates story JSON → pages with text and image prompts
4. Imagen generates illustrations → base64 encoded images
5. Storybook object created → added to app state
6. Navigation to bookshelf → displays generated book

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (uses mock data if no API key)
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

## Environment Configuration

Create `.env.local` file:
```
GEMINI_API_KEY=your_api_key_here
```

The Vite config (vite.config.ts:9-10) exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` in the app.

## Critical Implementation Details

### Gemini Service Behavior
- **Development mode**: Uses mock generator with 8-second delay
- **Production mode**: Requires valid GEMINI_API_KEY
- **Fallback**: Automatically uses mock if API key missing

### Image Handling
- Character images converted to base64 for Gemini processing
- Generated images returned as base64 data URLs
- Cover images use 3:4 aspect ratio, page images use 4:3

### State Management
- Books array managed at App level, passed via props
- No external state management library
- Mock data from constants.ts for initial demo books

### Path Aliases
- `@/` resolves to project root (configured in vite.config.ts:13 and tsconfig.json:22-24)