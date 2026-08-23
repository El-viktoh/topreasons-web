const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('rentals')
    .update({ type: 'LUXURY' })
    .eq('type', 'PREMIUM')
    .select();

  if (error) {
    console.error('Error updating rentals:', error);
  } else {
    console.log(`Updated ${data.length} rentals from PREMIUM to LUXURY.`);
  }
}
main();
