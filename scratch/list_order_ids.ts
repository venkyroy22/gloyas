import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snvijdlzfwcrrnhoggpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudmlqZGx6ZndjcnJuaG9nZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjU0MjksImV4cCI6MjA5MjEwMTQyOX0.FpuUKSEjAtflp7jtLZ_fDjLxFttTErQo07p-i3wKtVI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listIds() {
  const { data, error } = await supabase.from('orders').select('id');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('IDs in database:');
    data.forEach(o => {
      console.log(`- ${o.id} (Short: ${o.id.substring(0, 8).toUpperCase()})`);
    });
  }
}

listIds();
