'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';

interface ImageCropperProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	imageSrc: string | null;
	onCropComplete: (croppedBlob: Blob) => void;
	aspectRatio?: number;
	circularCrop?: boolean;
}

export function ImageCropper({
	open,
	onOpenChange,
	imageSrc,
	onCropComplete,
	aspectRatio = 1,
	circularCrop = false,
}: ImageCropperProps) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isCropping, setIsCropping] = useState(false);

	const onCropChange = (crop: Point) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteHandler = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const handleSave = async () => {
		if (!imageSrc || !croppedAreaPixels) return;

		setIsCropping(true);
		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
			if (croppedImage) {
				onCropComplete(croppedImage);
				onOpenChange(false);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsCropping(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
					<DialogDescription>
						Adjust the image to fit the frame.
					</DialogDescription>
				</DialogHeader>
				<div className="relative h-80 w-full overflow-hidden rounded-md bg-black/50">
					{imageSrc && (
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={aspectRatio}
							onCropChange={onCropChange}
							onCropComplete={onCropCompleteHandler}
							onZoomChange={onZoomChange}
							cropShape={circularCrop ? 'round' : 'rect'}
							showGrid={false}
						/>
					)}
				</div>
				<div className="space-y-4 pt-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Zoom</span>
						<Slider
							value={[zoom]}
							min={1}
							max={3}
							step={0.1}
							onValueChange={(value) => setZoom(value[0])}
							className="flex-1"
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isCropping}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isCropping}>
							{isCropping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// Helper function to create the cropped image
async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area,
): Promise<Blob | null> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return null;
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('Canvas is empty'));
				return;
			}
			resolve(blob);
		}, 'image/jpeg');
	});
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
		image.src = url;
	});
}
