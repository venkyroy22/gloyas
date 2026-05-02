import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snvijdlzfwcrrnhoggpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudmlqZGx6ZndjcnJuaG9nZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjU0MjksImV4cCI6MjA5MjEwMTQyOX0.FpuUKSEjAtflp7jtLZ_fDjLxFttTErQo07p-i3wKtVI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch(shortId: string) {
  console.log(`Testing fetch for short ID: ${shortId}`);
  
  // 1. Try with .ilike() on id
  try {
    const { data: d1, error: e1 } = await supabase
      .from('orders')
      .select('id')
      .ilike('id', `${shortId}%`)
      .limit(1);
    console.log('1. .ilike() Result:', e1 ? e1.message : (d1?.length ? 'Found: ' + d1[0].id : 'Not Found'));
  } catch (err: any) {
    console.log('1. .ilike() Exception:', err.message);
  }

  // 2. Try fetching all and checking
  try {
    const { data: d2, error: e2 } = await supabase
      .from('orders')
      .select('id');
    
    if (d2) {
      const match = d2.find(o => o.id.substring(0, 8).toUpperCase() === shortId.toUpperCase());
      console.log('2. JS Filter Result:', match ? 'Found: ' + match.id : 'Not Found');
    } else {
      console.log('2. JS Filter Error:', e2?.message);
    }
  } catch (err: any) {
    console.log('2. JS Filter Exception:', err.message);
  }
}

const targetId = 'E0505FBE';
testFetch(targetId);
