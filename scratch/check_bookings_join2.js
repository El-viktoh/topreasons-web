const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
        .from("bookings")
        .select("*, rentals (title, type, location)")
        .order("created_at", { ascending: false });
  if (error) {
    console.error('Error fetching bookings:', error);
  } else {
    console.log(`Found ${data.length} bookings.`);
    if (data.length > 0) console.log(data[0]);
  }
}
main();
