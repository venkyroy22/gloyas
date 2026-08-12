import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const STREAMLET_API_KEY = process.env.STREAMLET_API_KEY;
const STREAMLET_ACCOUNT_NUMBER = process.env.STREAMLET_ACCOUNT_NUMBER;

if (!STREAMLET_API_KEY || !STREAMLET_ACCOUNT_NUMBER) {
  console.error("Missing Streamlet API credentials in .env.local");
  process.exit(1);
}

const imagesDir = path.join(__dirname, '../public/images');
const outputJsonPath = path.join(__dirname, 'upload_results.json');

async function uploadImage(filePath, fileName) {
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: 'image/png' }); // Assuming PNGs based on previous list
  
  const formData = new FormData();
  formData.append('image', blob, fileName);

  const response = await fetch('https://api.streamletedge.com/api-key/upload-image', {
    method: 'POST',
    headers: {
      'x-streamlet-api-key': STREAMLET_API_KEY,
      'x-streamlet-account-number': STREAMLET_ACCOUNT_NUMBER,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed for ${fileName}: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.cdnUrl;
}

async function main() {
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
  const results = {};

  console.log(`Found ${files.length} images to upload...`);

  for (const file of files) {
    console.log(`Uploading ${file}...`);
    try {
      const cdnUrl = await uploadImage(path.join(imagesDir, file), file);
      results[file] = cdnUrl;
      console.log(`✅ Success: ${cdnUrl}`);
    } catch (e) {
      console.error(`❌ Error uploading ${file}:`, e.message);
    }
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${outputJsonPath}`);
}

main().catch(console.error);
