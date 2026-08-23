const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('rentals').select('id, features');
  if (error) {
    console.error('Error fetching rentals:', error);
    return;
  }

  let updatedCount = 0;
  for (const rental of data) {
    if (rental.features && rental.features.includes('category:PREMIUM')) {
      const newFeatures = rental.features.map(f => f === 'category:PREMIUM' ? 'category:LUXURY' : f);
      const { error: updateError } = await supabase
        .from('rentals')
        .update({ features: newFeatures })
        .eq('id', rental.id);
      
      if (!updateError) {
        updatedCount++;
      }
    }
  }

  console.log(`Updated ${updatedCount} rentals from PREMIUM to LUXURY in features array.`);
}
main();
