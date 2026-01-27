import { getData, postData } from './index';
import './types';

/**
 * Get Cloudinary signature for secure client-side upload
 */
export const getCloudinarySignature = (params?: {
	folder?: string;
	public_id?: string;
}): ApiRequestResponseType<{
	signature: string;
	timestamp: number;
	cloudName: string;
	apiKey: string;
}> => {
	return postData('/api/v1/upload/cloudinary-signature', params);
};

/**
 * Get Mux Direct Upload URL
 */
export const getMuxUploadUrl = (data: {
	cors_origin?: string;
}): ApiRequestResponseType<{
	uploadUrl: string;
	uploadId: string;
}> => {
	return postData('/api/v1/upload/mux-url', data);
};
