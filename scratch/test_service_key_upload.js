const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  const filePath = 'admin-upload/test.png';
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  
  const { data, error } = await supabaseAdmin.storage
    .from('rental-images')
    .upload(filePath, buffer, {
      contentType: 'image/png'
    });
    
  console.log('Admin Upload check:', data, error);
}

test();
