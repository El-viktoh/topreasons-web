const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Updating PREMIUM to LUXURY...");
  let { data, error } = await supabase
    .from('rentals')
    .update({ type: 'LUXURY' })
    .eq('type', 'PREMIUM');
  if (error) console.error("Error updating PREMIUM:", error);
  else console.log("Updated PREMIUM successfully.");

  console.log("Updating PREMIUM SUV'S to LUXURY SUV'S...");
  let res2 = await supabase
    .from('rentals')
    .update({ type: "LUXURY SUV'S" })
    .eq('type', "PREMIUM SUV'S");
  if (res2.error) console.error("Error updating PREMIUM SUV'S:", res2.error);
  else console.log("Updated PREMIUM SUV'S successfully.");
}
main();
