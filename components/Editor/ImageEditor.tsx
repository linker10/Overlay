"use client";
import useImageStore from "@/stores/imageStore";
import WelcomeMessage from "@/components/WelcomeScreen";
import Canvas from "@/components/Editor/Canvas/CanvasContainer";
import useLayerStore from "@/stores/layerStore";
import TextManager from "@/components/Editor/Layers/Text/TextManager";
import useFontsStore from "@/stores/fontStore";
import { useEffect } from "react";
import { FontOption } from "@/types/index.type";
import AutoSaveManager from "../AutoSaveManager";
import ImageAutoSaveManager from "../ImageAutoSaveManager";

interface ImageEditorProps {
    fonts: FontOption[];
}

/**
 * Orchestrates the editor layout: autosave managers, canvas, and text controls.
 *
 * Hydrates the font store on first mount if empty, then renders the canvas
 * and, when a text layer is selected, the `TextManager` side panel.
 */
const ImageEditor = ({ fonts }: ImageEditorProps) => {
    const { selectedImage } = useImageStore();
    const { selectedTextLayerId } = useLayerStore();

    const hydrate = useFontsStore((s) => s.hydrate);

    useEffect(() => {
        const current = useFontsStore.getState().fonts;
        if (!current || current.length === 0) {
            hydrate(fonts);
        }
    }, [fonts, hydrate]);

    return (
        <>
            <AutoSaveManager />
            <ImageAutoSaveManager />
            {!selectedImage ? (
                <WelcomeMessage />
            ) : (
                <div className={`grid grid-cols-4 gap-4 h-full`}>
                    <div className={`${selectedTextLayerId ? 'col-span-3' : 'col-span-4'}`}>
                        <Canvas />
                    </div>
                    {selectedTextLayerId && (
                        <div className="col-span-1">
                            <TextManager />
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ImageEditor
