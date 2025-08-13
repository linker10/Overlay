"use client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Editor from '@/components/Editor/Canvas/Stage/EditorStage'
import { Button } from '@/components/ui/button'
import useCanvasStore from '@/stores/canvasStore'
import useImageStore from '@/stores/imageStore'
import { getExportData } from '@/utils/canvasUtils'

/**
 * Canvas container that renders the editor stage and provides export controls.
 *
 * Displays a Card header with an Export button that saves the current stage as a PNG
 * at the original image resolution using Konva's pixelRatio.
 */
const Canvas = () => {
  const { stage } = useCanvasStore();
  const { selectedImage } = useImageStore();

  /**
   * Export the current canvas to a PNG file.
   *
   * Validates that a stage and image are present, then uses getExportData to generate
   * a dataURL and triggers a download in the browser.
   */
  const handleExport = () => {
    if (!stage || !selectedImage) {
      alert('Please upload an image and add some text before exporting.');
      return;
    }

    try {
      // Get original image dimensions
      const { dataURL } = getExportData(stage);

      const link = document.createElement('a');
      link.download = `image-text-composer-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Canvas</CardTitle>
        <CardAction className='flex items-center gap-2'>
          <Button onClick={handleExport}>
            Export to PNG
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="h-full flex items-center justify-center">
        <Editor />
      </CardContent>
    </Card>
  )
}

export default Canvas
