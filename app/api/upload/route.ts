import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const filePath = formData.get("filePath") as string;

    if (!file || !bucket || !filePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify admin status
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    
    // We create an anon client to verify their token
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: { user } } = await supabaseAnon.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to check role and bypass RLS for upload
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
