require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function test() {
  const { data, error } = await supabase.storage.getBucket('rental-images');
  console.log('Bucket check:', data, error);
}

test();
