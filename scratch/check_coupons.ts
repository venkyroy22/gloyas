import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error checking coupons table:', error);
  } else {
    const columns = data && data.length > 0 ? Object.keys(data[0]) : 'No data found to determine columns';
    console.log('Coupons table check successful. Columns found:', columns);
  }
}

checkTable();
