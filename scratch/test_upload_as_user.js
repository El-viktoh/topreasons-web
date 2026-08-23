const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  const email = 'test_user_' + Date.now() + '@example.com';
  const password = 'password123';
  
  // Create user
  const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (adminError) {
    console.error('Error creating user:', adminError);
    return;
  }
  
  console.log('User created:', adminData.user.id);
  
  // Login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (authError) {
    console.error('Error signing in:', authError);
    return;
  }
  
  console.log('Logged in as:', authData.user.id);
  
  // Upload image
  const userId = authData.user.id;
  const fileName = 'test.png';
  const filePath = `${userId}/${fileName}`;
  
  // Create a dummy 1x1 png buffer
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('rental-images')
    .upload(filePath, buffer, {
      contentType: 'image/png'
    });
    
  console.log('Upload check:', uploadData, uploadError);
}

test();
