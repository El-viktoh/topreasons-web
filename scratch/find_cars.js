const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('id, title, features').eq('type', 'car');
  if (error) {
    console.error('Error fetching rentals:', error);
  } else {
    data.forEach(car => {
      console.log(`ID: ${car.id} | Title: ${car.title} | Category: ${car.features?.find(f => f.startsWith('category:'))}`);
    });
  }
}
main();
