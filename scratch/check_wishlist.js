const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Checking favorites table...");
  const { data: favs, error: favErr } = await supabase.from("favorites").select("*");
  if (favErr) console.error("Fav Error:", favErr);
  else console.log("Favorites:", favs);
  
  if (favs && favs.length > 0) {
    const ids = favs.map(f => f.rental_id);
    const { data: rentals, error: rentErr } = await supabase
      .from("rentals")
      .select("id, title, approval_status")
      .in("id", ids);
      
    if (rentErr) console.error("Rentals Error:", rentErr);
    else console.log("Rentals found:", rentals);
  }
}
run();
