
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CreationOptions, Page, Storybook } from "../types";

// This function is for converting a file to a base64 string.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Mock function to simulate API calls for development and UI testing.
const generateStorybookMock = (options: CreationOptions): Promise<Storybook> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { storyPrompt } = options;
      const newBook: Storybook = {
        id: new Date().toISOString(),
        title: storyPrompt.split(' ').slice(0, 5).join(' ') || "A New Adventure",
        coverImageUrl: `https://picsum.photos/seed/${Math.random()}/600/800`,
        pages: Array.from({ length: options.pageCount }, (_, i) => ({
          pageNumber: i + 1,
          text: `This is page ${i + 1} of the story about ${storyPrompt}.`,
          imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
        })),
      };
      resolve(newBook);
    }, 8000); // Simulate network and generation delay
  });
};

// Real Gemini API implementation
const generateStorybookWithGemini = async (options: CreationOptions): Promise<Storybook> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mocked data.");
    return generateStorybookMock(options);
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Generate story text and image prompts
  const storyGenerationPrompt = `
    You are a creative storyteller for children aged ${options.ageGroup}.
    Your task is to write a story based on the following prompt: "${options.storyPrompt}".
    The story should have exactly ${options.pageCount} pages.
    The main character should be based on the provided image.
    For each page, provide the story text and a detailed, vivid prompt for an illustration in the style of "${options.style}".
    The illustration prompt should describe the scene, characters, actions, and emotions.
  `;

  const imagePart = await fileToGenerativePart(options.characterImage);
  const textPart = { text: storyGenerationPrompt };

  const storyResponse: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                pages: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pageNumber: { type: Type.INTEGER },
                            text: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    }
  });

  const storyData = JSON.parse(storyResponse.text);

  // 2. Generate images for each page
  const pages: Page[] = [];
  let coverImageUrl = 'https://picsum.photos/seed/default/600/800';

  for (let i = 0; i < storyData.pages.length; i++) {
    const pageData = storyData.pages[i];
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: pageData.imagePrompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '4:3',
            outputMimeType: 'image/jpeg',
        }
    });

    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    
    if (i === 0) {
        // For the cover, we generate a portrait image
        const coverResponse = await ai.models.generateImages({
             model: 'imagen-4.0-generate-001',
             prompt: `A beautiful book cover for a story titled "${storyData.title}". Style: ${options.style}. Main subject: ${pageData.imagePrompt}`,
             config: {
                numberOfImages: 1,
                aspectRatio: '3:4',
                outputMimeType: 'image/jpeg',
             }
        });
        const coverBase64 = coverResponse.generatedImages[0].image.imageBytes;
        coverImageUrl = `data:image/jpeg;base64,${coverBase64}`;
    }

    pages.push({
      pageNumber: pageData.pageNumber,
      text: pageData.text,
      imageUrl: imageUrl,
    });
  }

  return {
    id: new Date().toISOString(),
    title: storyData.title,
    coverImageUrl,
    pages,
  };
};

export const generateStorybook = process.env.NODE_ENV === 'development' || !process.env.API_KEY
  ? generateStorybookMock
  : generateStorybookWithGemini;
