'use client';

import { useState } from 'react';
import { uploadImageToStreamlet } from '@/lib/streamlet';
import Image from 'next/image';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cdnUrl, setCdnUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setCdnUrl(null);

    try {
      const url = await uploadImageToStreamlet(file);
      setCdnUrl(url);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-20 pt-32">
      <h1 className="text-3xl font-bold mb-8">Streamlet Upload Test</h1>
      
      <div className="flex flex-col gap-4 max-w-md">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload to Streamlet'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded">
            Error: {error}
          </div>
        )}

        {cdnUrl && (
          <div className="mt-8 flex flex-col gap-4">
            <h2 className="font-medium text-green-600">Upload Successful!</h2>
            <p className="text-sm break-all bg-gray-50 p-2 rounded">{cdnUrl}</p>
            <div className="relative w-full aspect-video border rounded overflow-hidden">
              <Image 
                src={cdnUrl} 
                alt="Uploaded file" 
                fill 
                className="object-contain" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
