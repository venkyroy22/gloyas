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
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data: StreamletUploadResponse = await response.json();
    return data.cdnUrl;
  } catch (error) {
    console.error('Upload utility error:', error);
    throw error;
  }
};
