const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('rentals')
    .select('type');

  if (error) {
    console.error('Error fetching rentals:', error);
  } else {
    const types = new Set(data.map(r => r.type));
    console.log('Types in DB:', Array.from(types));
  }
}
main();
