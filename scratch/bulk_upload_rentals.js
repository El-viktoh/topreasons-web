const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const manifestPath = "/Users/victoryeboah/Car_generated_img/website_upload_manifest.json";
const baseImgPath = "/Users/victoryeboah/Car_generated_img";
const bucketName = "rental-images";

const categoryMap = {
  "Saloon Plus": "SALOON PLUS",
  "Compact SUV's": "PREMIUM SUV'S",
  "Premium SUV's": "PREMIUM SUV'S",
  "4x4's": "4X4's",
  "Luxury": "PREMIUM",
  "Vans": "VANS / BUSES COACHES",
  "Buses and Coaches": "VANS / BUSES COACHES",
  "Mini Vans": "VANS / BUSES COACHES",
  "EV's": "EV'S"
};

async function run() {
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const record of manifestData) {
    if (record.category === 'Basic' || record.category === 'Standard') {
      skipCount++;
      continue;
    }

    const mappedCategory = categoryMap[record.category];
    if (!mappedCategory) {
      console.warn(`Warning: Unknown category mapping for ${record.category}`);
      failCount++;
      continue;
    }

    // Read the 4 images
    const images = record.images;
    // We want Front as index 0, then front_left_3q, front_right_3q, back
    const imageKeys = ['front', 'front_left_3q', 'front_right_3q', 'back'];
    const uploadedUrls = [];

    let uploadFailed = false;

    for (const key of imageKeys) {
      const filename = images[key];
      if (!filename) continue;

      const filePathOnDisk = path.join(baseImgPath, record.category, filename);
      if (!fs.existsSync(filePathOnDisk)) {
        console.error(`File not found: ${filePathOnDisk}`);
        uploadFailed = true;
        break;
      }

      const fileBuffer = fs.readFileSync(filePathOnDisk);
      const ext = path.extname(filename);
      // Construct a unique filename
      const uniqueFileName = `bulk-upload/${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, fileBuffer, {
          contentType: ext === '.png' ? 'image/png' : 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error(`Failed to upload ${filename}:`, error);
        uploadFailed = true;
        break;
      }

      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFileName);
      uploadedUrls.push(urlData.publicUrl);
    }

    if (uploadFailed) {
      failCount++;
      continue;
    }

    // Insert record
    const featuresWithCategory = [`category:${mappedCategory}`];
    const rentalData = {
      title: record.title,
      description: "",
      type: "car",
      location: "Accra, Accra",
      price_per_day: 1000,
      image_url: uploadedUrls[0] || null,
      images: uploadedUrls,
      features: featuresWithCategory,
      available: true,
    };

    const { error: insertError } = await supabase.from("rentals").insert(rentalData);

    if (insertError) {
      console.error(`Failed to insert rental for ${record.title}:`, insertError);
      failCount++;
    } else {
      successCount++;
      console.log(`Successfully created: ${record.title} (${mappedCategory})`);
    }
  }

  console.log('--- Summary ---');
  console.log(`Successfully created: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Failed: ${failCount}`);
}

run().catch(console.error);
