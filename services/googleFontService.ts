import { FontOption } from '@/types/index.type';

interface GoogleFontItem {
  family: string;
  category: string;
  variants: string[];
}

interface GoogleFontsResponse {
  items: GoogleFontItem[];
}

const GOOGLE_FONTS_API = `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}&sort=popularity`;

/**
 * Service for fetching and managing Google Fonts with basic caching.
 */
class FontService {
  private fonts: FontOption[] = [];
  private isLoading = false;
  private isLoaded = false;

  /**
   * Fetch and cache the fonts list from Google Fonts API (or fallback locally).
   */
  async loadFonts(): Promise<FontOption[]> {
    if (this.isLoaded) {
      return this.fonts;
    }

    if (this.isLoading) {
      // Wait for the current loading to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.fonts;
    }

    this.isLoading = true;

    try {
      const response = await fetch(GOOGLE_FONTS_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GoogleFontsResponse = await response.json();
      this.fonts = data.items.map((font: GoogleFontItem) => ({
        family: font.family,
        category: font.category,
        variants: font.variants,
      }));
      
      this.isLoaded = true;
      return this.fonts;
    } catch (error) {
      console.error('Failed to load Google Fonts:', error);
      // Fallback to system fonts
      this.fonts = this.getFallbackFonts();
      this.isLoaded = true;
      return this.fonts;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Fallback list of common system fonts when API calls fail.
   */
  private getFallbackFonts(): FontOption[] {
    return [
      { family: 'Arial', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Helvetica', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Times New Roman', category: 'serif', variants: ['400', '700'] },
      { family: 'Georgia', category: 'serif', variants: ['400', '700'] },
      { family: 'Verdana', category: 'sans-serif', variants: ['400', '700'] },
      { family: 'Courier New', category: 'monospace', variants: ['400', '700'] },
      { family: 'Impact', category: 'sans-serif', variants: ['400'] },
      { family: 'Comic Sans MS', category: 'cursive', variants: ['400'] },
    ];
  }

  /**
   * Dynamically append a stylesheet link for the given font family.
   */
  async loadFont(fontFamily: string): Promise<void> {
    if (fontFamily === 'Arial' || fontFamily === 'Helvetica' || fontFamily === 'Times New Roman') {
      return; // System fonts don't need loading
    }

    try {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } catch (error) {
      console.error(`Failed to load font ${fontFamily}:`, error);
    }
  }

  /** Get fonts by category (e.g., 'serif', 'sans-serif'). */
  getFontsByCategory(category?: string): FontOption[] {
    if (!category) return this.fonts;
    return this.fonts.filter(font => font.category === category);
  }

  /** Search fonts by family name substring. */
  searchFonts(query: string): FontOption[] {
    if (!query) return this.fonts;
    const lowerQuery = query.toLowerCase();
    return this.fonts.filter(font => 
      font.family.toLowerCase().includes(lowerQuery)
    );
  }
}

export const fontService = new FontService();
