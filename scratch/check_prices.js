const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('id, title, price_per_day, image_url').in('title', ['Honda CRV', 'Toyota RAV4', 'Hyundai SantaFe', 'Mitsubishi Outlander', 'Hyundai Creta', 'Kia Soul', 'Toyota Highlander', 'Kia Sorento']);
  if (error) {
    console.error('Error fetching rentals:', error);
  } else {
    data.forEach(d => {
       console.log(`Title: ${d.title} | Price: ${d.price_per_day} | ID: ${d.id}`);
    })
  }
}
main();
