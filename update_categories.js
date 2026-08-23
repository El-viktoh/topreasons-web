const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://sxfiyknlmashbbtcuqqp.supabase.co', process.env.SUPABASE_SECRET_KEY);

const categoryMap = {
  // VANS
  "Hyundai H1Starex": "category:VANS",
  "Hyundai Staria": "category:VANS",
  "Toyota Hiace": "category:VANS",
  "Nissan Urvan": "category:VANS",
  "Ford Transit": "category:VANS",
  "Mercedes-Benz Sprinter": "category:VANS",
  "Foton 15Seater": "category:VANS",

  // Buses and Coaches
  "Toyota Coaster": "category:Buses and Coaches",
  "Hyundai 33Seater": "category:Buses and Coaches",
  "Yutong 45Seater": "category:Buses and Coaches",

  // MINI VANS
  "Toyota Voxy": "category:MINI VANS",
  "Toyota Vellfire": "category:MINI VANS",
  "Nissan Elgrand": "category:MINI VANS",
  "Hyundai Staria8Seater": "category:MINI VANS",
  "Kia Sedona": "category:MINI VANS",
  "Toyota Granvia": "category:MINI VANS"
};

(async () => {
  const { data: rentals, error: fetchError } = await supabase.from('rentals').select('id, title, features');
  if (fetchError) {
    console.error(fetchError);
    process.exit(1);
  }

  for (const rental of rentals) {
    const newCategory = categoryMap[rental.title];
    if (newCategory) {
      // replace the old category feature with the new one
      const newFeatures = rental.features.map(f => f.startsWith('category:') ? newCategory : f);
      
      const { error: updateError } = await supabase
        .from('rentals')
        .update({ features: newFeatures })
        .eq('id', rental.id);

      if (updateError) {
        console.error(`Error updating ${rental.title}:`, updateError);
      } else {
        console.log(`Updated ${rental.title} to ${newCategory}`);
      }
    }
  }
  console.log("Done updating categories.");
})();
