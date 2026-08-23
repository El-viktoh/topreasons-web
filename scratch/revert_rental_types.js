const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Reverting LUXURY SUV'S to PREMIUM SUV'S...");
  let res = await supabase
    .from('rentals')
    .update({ type: "PREMIUM SUV'S" })
    .eq('type', "LUXURY SUV'S");
  if (res.error) console.error("Error reverting:", res.error);
  else console.log("Reverted successfully.");
}
main();
