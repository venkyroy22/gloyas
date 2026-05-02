/**
 * Streamlet.in Image Cloud Storage Utility
 * 
 * This utility handles image uploads to Streamlet.in, which provides 
 * optimized image delivery via a global CDN.
 */

const STREAMLET_API_URL = 'https://api.streamlet.in/api-key/upload-image';

export interface StreamletUploadResponse {
  status: string;
  message: string;
  cdnUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * Uploads an image to Streamlet.in
 * @param file The image file to upload
 * @returns The CDN URL of the uploaded image
 */
export const uploadToStreamlet = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_STREAMLET_API_KEY;
  const accountNumber = process.env.NEXT_PUBLIC_STREAMLET_ACCOUNT_NUMBER;

  if (!apiKey || !accountNumber) {
    console.error('Streamlet credentials missing. Please check your environment variables.');
    throw new Error('Streamlet integration not configured');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(STREAMLET_API_URL, {
      method: 'POST',
      headers: {
        'x-streamlet-api-key': apiKey,
        'x-streamlet-account-number': accountNumber,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image to Streamlet');
    }

    const data: StreamletUploadResponse = await response.json();
    return data.cdnUrl;
  } catch (error) {
    console.error('Error uploading to Streamlet:', error);
    throw error;
  }
};
