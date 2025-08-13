import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUploader from '@/components/ImageUploader'
import { cn } from '@/lib/utils'

const ImageUploadCard = ({ className }: { className?: string }) => {
    return (
        <Card className={cn("w-full", className)}   >
            <CardHeader>
                <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
                <ImageUploader />
            </CardContent>
        </Card>
    )
}

export default ImageUploadCard
