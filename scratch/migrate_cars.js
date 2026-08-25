const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearOldCars() {
  console.log('Fetching cars to delete...');
  const { data, error } = await supabase.from('rentals').select('id, features');
  if (error) {
    console.error('Error fetching rentals:', error);
    return;
  }
  
  const toDelete = data.filter(r => r.features && (r.features.includes("category:COMPACT SUV'S") || r.features.includes("category:PREMIUM SUV'S")));
  
  console.log(`Found ${toDelete.length} cars to delete.`);
  for (const car of toDelete) {
    const { error: delError } = await supabase.from('rentals').delete().eq('id', car.id);
    if (delError) console.error(`Error deleting ${car.id}:`, delError);
    else console.log(`Deleted ${car.id}`);
  }
}

async function uploadFile(filePath, fileName) {
    const fileBuffer = fs.readFileSync(filePath);
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
        .from('rental-images')
        .upload(`bulk-upload/${uniqueFileName}`, fileBuffer, {
            contentType: 'image/png'
        });
    if (error) {
        console.error(`Error uploading ${fileName}:`, error);
        return null;
    }
    const { data: publicUrlData } = supabase.storage
        .from('rental-images')
        .getPublicUrl(`bulk-upload/${uniqueFileName}`);
    return publicUrlData.publicUrl;
}

function parseFilename(filename) {
    // e.g. CompactSUVs_Honda_CRV_2016_FrontLeft34_White.png
    // PremiumSUVs_Honda_CRV_2020_Front_Black.png
    const parts = filename.replace('.png', '').split('_');
    const categoryRaw = parts[0]; // CompactSUVs or PremiumSUVs
    const category = categoryRaw === 'CompactSUVs' ? "COMPACT SUV'S" : "PREMIUM SUV'S";
    
    // Some names have 2 parts (Honda CRV), some have 1 (Toyota RAV4 -> wait, it's Toyota_RAV4_2016 -> 2 parts)
    // Looking at the list, parts are usually:
    // [0]: Category
    // [1]: Make
    // [2]: Model
    // [3]: Year
    // [4]: Angle
    // [5]: Color
    
    // There might be variations if model has spaces? Let's assume Make is [1], Model is [2]. Wait, Toyota LandCruiserV8?
    // Let's just group them by the first 4 parts to form the car identity.
    const make = parts[1];
    const model = parts[2];
    const year = parts[3];
    const angle = parts[4];
    
    const title = `${make} ${model}`.replace(/([a-z])([A-Z])/g, '$1 $2'); // e.g. SantaFe -> Santa Fe
    const identifier = `${category}_${make}_${model}_${year}`; // Unique for each specific car
    
    return { category, title, angle, identifier, make, model };
}

async function processFolder(folderPath) {
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'));
    const carsMap = {};
    
    for (const file of files) {
        const parsed = parseFilename(file);
        if (!carsMap[parsed.identifier]) {
            carsMap[parsed.identifier] = {
                title: parsed.title,
                category: parsed.category,
                images: {},
                files: []
            };
        }
        carsMap[parsed.identifier].files.push({ file, angle: parsed.angle, fullPath: path.join(folderPath, file) });
    }
    
    // Now upload and insert
    for (const id in carsMap) {
        const car = carsMap[id];
        console.log(`Processing ${car.title} for ${car.category}...`);
        
        const imageUrls = [];
        let mainImageUrl = '';
        
        for (const fileObj of car.files) {
            console.log(`Uploading ${fileObj.file}...`);
            const url = await uploadFile(fileObj.fullPath, fileObj.file);
            if (url) {
                imageUrls.push(url);
                if (fileObj.angle === 'Front') {
                    mainImageUrl = url;
                }
            }
        }
        
        if (!mainImageUrl && imageUrls.length > 0) mainImageUrl = imageUrls[0];
        
        const insertData = {
            title: car.title,
            description: `Experience the comfort and style of the ${car.title}.`,
            type: 'car',
            location: 'Accra',
            price_per_day: 1000,
            image_url: mainImageUrl,
            images: imageUrls,
            features: [`category:${car.category}`],
            available: true
        };
        
        const { error } = await supabase.from('rentals').insert([insertData]);
        if (error) {
            console.error(`Error inserting ${car.title}:`, error);
        } else {
            console.log(`Successfully inserted ${car.title}`);
        }
    }
}

async function main() {
    await clearOldCars();
    console.log('Processing COMPACT SUVs...');
    await processFolder("/Users/victoryeboah/Downloads/Car_generated_img/Compact SUV's");
    console.log('Processing PREMIUM SUVs...');
    await processFolder("/Users/victoryeboah/Downloads/Car_generated_img/Premium SUV's");
    console.log('Done!');
}

main();
