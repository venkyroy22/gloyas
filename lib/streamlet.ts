/**
 * Uploads an image to the Streamlet API via our secure backend proxy route.
 * 
 * @param file The image File object from an input element
 * @returns The CDN URL of the uploaded image
 */
export async function uploadImageToStreamlet(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const data = await response.json();
  
  if (!data.cdnUrl) {
    throw new Error('No CDN URL returned from server');
  }

  return data.cdnUrl;
}
