import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const uploadResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'upload_results.json'), 'utf-8'));
const urlMap = {};
uploadResults.forEach(item => {
  urlMap[`/${item.fileName}`] = item.cdnUrl;
  urlMap[item.fileName] = item.cdnUrl;
});

async function updateProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  for (const product of products) {
    let updated = false;
    const newImages = product.images.map(img => {
      if (urlMap[img]) {
        updated = true;
        return urlMap[img];
      }
      return img;
    });

    if (updated) {
      console.log(`Updating product: ${product.name}`);
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id);
      
      if (updateError) console.error(`Error updating ${product.name}:`, updateError);
    }
  }
  console.log('Database update complete.');
}

updateProducts();
