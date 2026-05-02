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
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      } else {
        const text = await response.text();
        if (response.status === 413) {
          throw new Error('The image file is too large. Please use a file smaller than 4MB.');
        }
        throw new Error(`Upload failed (${response.status}): ${text.substring(0, 50)}`);
      }
    }

    const data: StreamletUploadResponse = await response.json();
    return data.cdnUrl;
  } catch (error) {
    console.error('Upload utility error:', error);
    throw error;
  }
};

/**
 * Deletes an image from Streamlet.in
 * @param cdnUrl The full CDN URL of the image to delete
 */
export const deleteFromStreamlet = async (cdnUrl: string): Promise<void> => {
  try {
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cdnUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to delete image from Streamlet:', errorData.message);
    }
  } catch (error) {
    console.error('Delete utility error:', error);
  }
};
