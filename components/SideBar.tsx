"use client"
import useImageStore from "@/stores/imageStore"
import ImageUploadCard from "@/components/ImageUploader"
import LayersManager from "@/components/Editor/Layers/LayersManager"


/**
 * Sidebar hosting the image uploader and, when applicable, the layers manager.
 */
const SideBar = () => {
    const { selectedImage } = useImageStore(state => state);
    return (
        <>
            <ImageUploadCard />
            {
                selectedImage && (
                    <LayersManager />
                )
            }
        </>
    )
}

export default SideBar
