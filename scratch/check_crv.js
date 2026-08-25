const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('id, title, description, features, image_url').eq('title', 'Honda CRV');
  if (error) {
    console.error('Error fetching rentals:', error);
  } else {
    data.forEach(d => {
       console.log(`ID: ${d.id} | Title: ${d.title} | Desc: ${d.description} | Image: ${d.image_url}`);
    })
  }
}
main();
