"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, X, Plus, Image } from "lucide-react";

interface MultiImageUploadProps {
  bucket: string;
  folder?: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultiImageUpload({ bucket, folder, images, onImagesChange, maxImages = 5, maxSizeMB = 5 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) { toast.error(`Maximum ${maxImages} images allowed`); return; }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        if (file.size > maxSizeMB * 1024 * 1024) { toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`); continue; }
        if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
        if (uploadError) { toast.error(`Failed to upload ${file.name}`); continue; }

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        uploadedUrls.push(urlData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded`);
      }
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => onImagesChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Main</span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <label className={`aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" disabled={uploading} />
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Image className="w-3 h-3" />
        {images.length}/{maxImages} images • Max {maxSizeMB}MB each
      </p>
    </div>
  );
}
