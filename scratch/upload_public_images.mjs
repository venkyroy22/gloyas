import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const API_KEY = env.NEXT_PUBLIC_STREAMLET_API_KEY;
const ACCOUNT_NUMBER = env.NEXT_PUBLIC_STREAMLET_ACCOUNT_NUMBER;
const API_URL = 'https://api.streamlet.in/api-key/upload-image';

const publicDir = path.resolve(__dirname, '../public');
const imagesToUpload = [
  '5_panel_cap.png',
  'baseball_cap.png',
  'beanie.png',
  'bucket_hat.png',
  'dad_cap.png',
  'docker_hat.png',
  'logo.png',
  'sanpback_cap.png',
  'tab_icon.jpg',
  'trucker_cap.png'
];

async function uploadImage(fileName) {
  const filePath = path.join(publicDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const type = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
  
  const blob = new Blob([fileBuffer], { type });
  
  const formData = new FormData();
  formData.append('image', blob, fileName);

  console.log(`Uploading ${fileName}...`);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-streamlet-api-key': API_KEY,
        'x-streamlet-account-number': ACCOUNT_NUMBER,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to upload ${fileName}: ${response.status} ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`Successfully uploaded ${fileName}: ${data.cdnUrl}`);
    return { fileName, cdnUrl: data.cdnUrl };
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
    return null;
  }
}

async function run() {
  if (!API_KEY || !ACCOUNT_NUMBER) {
    console.error('API_KEY or ACCOUNT_NUMBER missing in .env.local');
    process.exit(1);
  }

  const results = [];
  for (const fileName of imagesToUpload) {
    const result = await uploadImage(fileName);
    if (result) results.push(result);
  }

  console.log('\n--- Upload Results ---');
  console.log(JSON.stringify(results, null, 2));
  
  fs.writeFileSync(
    path.join(__dirname, 'upload_results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nResults saved to upload_results.json');
}

run();
