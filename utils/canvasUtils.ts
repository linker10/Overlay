import { Stage } from "konva/lib/Stage";

/**
 * Load a File into an HTMLImageElement.
 *
 * Creates an object URL for the provided file and resolves once the image is
 * fully loaded. The caller is responsible for revoking the object URL if
 * necessary.
 *
 * @param file - Image file (PNG recommended)
 * @returns Promise that resolves with the loaded HTMLImageElement
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compute canvas dimensions that fit within a max bounding box, preserving
 * aspect ratio. Also persists export-related metadata in localStorage so we
 * can later export at the image's original resolution.
 *
 * Max bounds are currently 800x600. If the image exceeds these, it will be
 * scaled down proportionally. The function stores both displayScale and
 * exportScalingFactor to support crisp exports via pixelRatio.
 *
 * @param img - Loaded image element
 * @returns Width and height for the canvas Stage
 */
export const getCanvasDimensions = (img: HTMLImageElement) => {
  const maxWidth = 800;
  const maxHeight = 600;

  let width = img.width;
  let height = img.height;
  let scale = 1;

  // Check if image exceeds max dimensions
  if (width > maxWidth || height > maxHeight) {
    // Calculate which dimension is the limiting factor
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;    
    // Use the smaller ratio to maintain aspect ratio
    scale = Math.min(widthRatio, heightRatio);
    
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // Compute export scaling factor and direction based on original vs current dimensions
  const originalWidth = img.width;
  const originalHeight = img.height;
  const exportScaleWidth = originalWidth / width;
  const exportScaleHeight = originalHeight / height;
  const exportScalingFactor = Math.max(exportScaleWidth, exportScaleHeight);
  const direction = exportScalingFactor > 1 ? 'up' : exportScalingFactor < 1 ? 'down' : 'same';

  localStorage.setItem('exportSize', JSON.stringify({
    width,
    height,
    originalWidth,
    originalHeight,
    // displayScale is how much we scaled down (<=1) to fit the canvas
    displayScale: scale,
    // exportScalingFactor is the inverse (>=1 for upscaling back to original)
    exportScalingFactor,
    direction,
  }));

  return {
    width,
    height,
  };
};

/**
 * Prepare export data for the current Konva Stage.
 *
 * Uses the scaling information saved by getCanvasDimensions to export a PNG at
 * the original image resolution. Relies on Konva's pixelRatio option to scale
 * all content proportionally at export time.
 *
 * @param stage - Konva Stage instance to export
 * @returns Object containing a dataURL for a PNG image
 */
export const getExportData = (stage: Stage) => {
  const stored = localStorage.getItem('exportSize');
  const stageWidth = stage.width();
  const stageHeight = stage.height();

  let originalWidth = stageWidth;
  let originalHeight = stageHeight;
  let currentWidth = stageWidth;
  let currentHeight = stageHeight;
  let scalingFactor = 1;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      originalWidth = parsed.originalWidth ?? originalWidth;
      originalHeight = parsed.originalHeight ?? originalHeight;
      currentWidth = parsed.width ?? currentWidth;
      currentHeight = parsed.height ?? currentHeight;
    } catch {
      // ignore and use defaults
    }
  }

  // Compute export scaling factor from original vs current
  const exportScaleWidth = originalWidth / currentWidth;
  const exportScaleHeight = originalHeight / currentHeight;
  scalingFactor = Math.max(exportScaleWidth, exportScaleHeight);

  // Export at original resolution using pixelRatio, which scales all content proportionally
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: 1,
    pixelRatio: scalingFactor,
  });

  return { dataURL } as const;
}
