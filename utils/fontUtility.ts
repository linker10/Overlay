import { FontOption } from "@/types/index.type";

export const FontUtility = {
  loadFont(fontFamily: string) {
    if (
      ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"].includes(
        fontFamily
      )
    ) {
      return;
    }

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      /\s+/g,
      "+"
    )}:wght@400;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  },

  searchFonts(fonts: FontOption[], query: string) {
    if (!query.trim()) return fonts;
    return fonts.filter((font) =>
      font.family.toLowerCase().includes(query.toLowerCase())
    );
  },

  filterByCategory(fonts: FontOption[], category?: string) {
    if (!category) return fonts;
    return fonts.filter((font) => font.category === category);
  },
};
