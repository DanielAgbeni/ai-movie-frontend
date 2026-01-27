'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ImageCropperProps {
	imageSrc: string | null;
	isOpen: boolean;
	onClose: () => void;
	onCropComplete: (croppedImageBlob: Blob) => void;
	aspect?: number;
}

export function ImageCropper({
	imageSrc,
	isOpen,
	onClose,
	onCropComplete,
	aspect = 1,
}: ImageCropperProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const onCropChange = (crop: { x: number; y: number }) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteHandler = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous');
			image.src = url;
		});

	const getCroppedImg = async (
		imageSrc: string,
		pixelCrop: Area,
	): Promise<Blob> => {
		const image = await createImage(imageSrc);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('No 2d context');
		}

		// set canvas size to match the bounding box
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		// draw image
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
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error('Canvas is empty'));
						return;
					}
					resolve(blob);
				},
				'image/jpeg',
				0.95,
			); // High quality jpeg
		});
	};

	const handleSave = async () => {
		if (!imageSrc || !croppedAreaPixels) return;
		setIsProcessing(true);
		try {
			const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
			onCropComplete(croppedBlob);
			onClose();
		} catch (e) {
			console.error(e);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Crop Image</DialogTitle>
				</DialogHeader>
				<div className="relative h-80 w-full bg-black rounded-md overflow-hidden">
					{imageSrc && (
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={aspect}
							onCropChange={onCropChange}
							onCropComplete={onCropCompleteHandler}
							onZoomChange={onZoomChange}
						/>
					)}
				</div>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Zoom</Label>
						<Slider
							value={[zoom]}
							min={1}
							max={3}
							step={0.1}
							onValueChange={(value) => setZoom(value[0])}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isProcessing}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isProcessing}>
						{isProcessing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing
							</>
						) : (
							'Save & Upload'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
