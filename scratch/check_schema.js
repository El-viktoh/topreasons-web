const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('*').limit(10);
  if (error) {
    console.error('Error fetching rentals:', error);
  } else {
    console.log('Columns:', Object.keys(data[0]));
    data.forEach(d => {
       console.log(`Title: ${d.title} | Subtitle: ${d.subtitle || ''} | Year: ${d.year || ''} | Make: ${d.make || ''} | Model: ${d.model || ''}`);
    })
  }
}
main();
