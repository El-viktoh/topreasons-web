const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const targetTitles = [
  'Honda CRV',
  'Toyota RAV4',
  'Hyundai SantaFe',
  'Mitsubishi Outlander',
  'Kia Sportage',
  'Hyundai Creta',
  'Kia Soul',
  'Hyundai Tucson',
  'Toyota Highlander',
  'Kia Sorento'
];

async function main() {
  const { data, error } = await supabase.from('rentals').select('id, title, features').in('title', targetTitles);
  if (error) {
    console.error('Error fetching rentals:', error);
    return;
  }

  let updatedCount = 0;
  for (const rental of data) {
    // We only care about modifying the category feature.
    let newFeatures = [];
    if (rental.features) {
      newFeatures = rental.features.filter(f => !f.startsWith('category:'));
    }
    newFeatures.push("category:COMPACT SUV'S");

    const { error: updateError } = await supabase
      .from('rentals')
      .update({ features: newFeatures })
      .eq('id', rental.id);
    
    if (!updateError) {
      updatedCount++;
      console.log(`Migrated ${rental.title} (${rental.id}) to COMPACT SUV'S`);
    } else {
      console.error(`Failed to migrate ${rental.title}`, updateError);
    }
  }

  console.log(`Successfully migrated ${updatedCount} vehicles to COMPACT SUV'S.`);
}
main();
