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

const publicDir = path.join(__dirname, '../public');
const outputJsonPath = path.join(__dirname, 'upload_results.json');

async function uploadImage(filePath, relativePath) {
  const buffer = fs.readFileSync(filePath);
  // Guess mime type from extension
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.webp') mimeType = 'image/webp';
  else if (ext === '.svg') mimeType = 'image/svg+xml';
  
  const blob = new Blob([buffer], { type: mimeType });
  const fileName = path.basename(filePath);
  
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
    throw new Error(`Upload failed for ${relativePath}: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.cdnUrl;
}

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      if (file.match(/\.(png|jpe?g|webp|svg)$/i)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

async function main() {
  let existingResults = {};
  if (fs.existsSync(outputJsonPath)) {
    existingResults = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));
  }

  const allFiles = getFilesRecursively(publicDir);
  console.log(`Found ${allFiles.length} total images in public directory...`);

  let newUploads = 0;

  for (const filePath of allFiles) {
    // Standardize path separators to forward slashes for the JSON key
    const relativePath = path.relative(publicDir, filePath).split(path.sep).join('/');
    
    // Also check if just the basename is already in there from the previous run
    const basename = path.basename(filePath);
    
    if (existingResults[relativePath] || existingResults[basename]) {
      // Already uploaded
      continue;
    }

    console.log(`Uploading ${relativePath}...`);
    try {
      const cdnUrl = await uploadImage(filePath, relativePath);
      existingResults[relativePath] = cdnUrl;
      console.log(`✅ Success: ${cdnUrl}`);
      newUploads++;
    } catch (e) {
      console.error(`❌ Error uploading ${relativePath}:`, e.message);
    }
  }

  if (newUploads > 0) {
    fs.writeFileSync(outputJsonPath, JSON.stringify(existingResults, null, 2));
    console.log(`\nResults saved to ${outputJsonPath}. Uploaded ${newUploads} new images.`);
  } else {
    console.log(`\nNo new images to upload.`);
  }
}

main().catch(console.error);
