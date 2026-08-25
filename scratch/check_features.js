const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('title, features').eq('title', 'Toyota Corolla').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log(data[0].features);
  }
}
main();
