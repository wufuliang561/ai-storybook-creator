
export interface Page {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Storybook {
  id: string;
  title: string;
  coverImageUrl: string;
  pages: Page[];
}

export interface CreationOptions {
  characterImage: File;
  storyPrompt: string;
  ageGroup: number;
  pageCount: number;
  style: string;
}
