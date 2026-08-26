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

const baseImgPath = path.join(__dirname, "../temp_yutong");
const bucketName = "rental-images";
const mappedCategory = "Buses and Coaches";

const vehicles = [
  {
    title: "Yutong 35Seater",
    images: {
      front: "BusesCoaches_Yutong_35Seater_Front_White.png",
      front_left_3q: "BusesCoaches_Yutong_35Seater_FrontLeft34_White.png",
      front_right_3q: "BusesCoaches_Yutong_35Seater_FrontRight34_White.png",
      back: "BusesCoaches_Yutong_35Seater_Back_White.png"
    }
  },
  {
    title: "Yutong 50Seater",
    images: {
      front: "BusesCoaches_Yutong_50Seater_Front_Black.png",
      front_left_3q: "BusesCoaches_Yutong_50Seater_FrontLeft34_Black.png",
      front_right_3q: "BusesCoaches_Yutong_50Seater_FrontRight34_Black.png",
      back: "BusesCoaches_Yutong_50Seater_Back_Black.png"
    }
  },
  {
    title: "Yutong 55Seater",
    images: {
      front: "BusesCoaches_Yutong_55Seater_Front_White.png",
      front_left_3q: "BusesCoaches_Yutong_55Seater_FrontLeft34_White.png",
      front_right_3q: "BusesCoaches_Yutong_55Seater_FrontRight34_White.png",
      back: "BusesCoaches_Yutong_55Seater_Back_White.png"
    }
  },
  {
    title: "Yutong 60Seater",
    images: {
      front: "BusesCoaches_Yutong_60Seater_Front_Black.png",
      front_left_3q: "BusesCoaches_Yutong_60Seater_FrontLeft34_Black.png",
      front_right_3q: "BusesCoaches_Yutong_60Seater_FrontRight34_Black.png",
      back: "BusesCoaches_Yutong_60Seater_Back_Black.png"
    }
  }
];

async function run() {
  for (const record of vehicles) {
    const images = record.images;
    const imageKeys = ['front', 'front_left_3q', 'front_right_3q', 'back'];
    const uploadedUrls = [];
    let uploadFailed = false;

    for (const key of imageKeys) {
      const filename = images[key];
      const filePathOnDisk = path.join(baseImgPath, filename);
      
      if (!fs.existsSync(filePathOnDisk)) {
        console.error(`File not found: ${filePathOnDisk}`);
        uploadFailed = true;
        break;
      }

      const fileBuffer = fs.readFileSync(filePathOnDisk);
      const ext = path.extname(filename);
      const uniqueFileName = `bulk-upload/yutong-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;

      console.log(`Uploading ${filename}...`);
      const { error } = await supabase.storage
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
      console.log(`Skipping insert for ${record.title} due to upload failure.`);
      continue;
    }

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
    } else {
      console.log(`Successfully created: ${record.title} (${mappedCategory})`);
    }
  }
}

run().catch(console.error);
