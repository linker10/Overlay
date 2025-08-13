/**
 * Shape of a text layer rendered on the canvas.
 */
export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  opacity: number;
  align: 'left' | 'center' | 'right';
  isEditing: boolean;
  fontFamily: string;
  fontVariant: string;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
  lineHeight: number;
}

/**
 * A font entry as returned by Google Fonts API or fallback list.
 */
export interface FontOption {
  family: string;
  category: string;
  variants: string[];
}
