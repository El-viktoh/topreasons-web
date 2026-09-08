import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

const SnapchatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" {...props}>
    <path d="M224.2 46.5c-42.3 0-77 34.6-77 77v5.7c-50.6 6.8-71 49.3-71 83 0 11.1 2.3 22.8 7.3 33.7-18.7 8.3-39.7 13.7-61.9 15.3-7.2 .5-13.3 5.4-15 12.3-1.6 7 2.1 14.1 8.8 16.7 44.8 17.6 72 50.1 77.8 84.7 4.2 24.6 20.3 35.5 45.4 46.9 14 6.3 29.5 13.3 43.1 24.7 2.3 1.9 5.2 2.9 8.2 2.9s5.9-1 8.2-2.9c13.5-11.4 29.1-18.3 43.1-24.7 25.1-11.4 41.2-22.3 45.4-46.9 5.8-34.6 33-67 77.8-84.7 6.6-2.6 10.4-9.7 8.8-16.7-1.6-6.9-7.8-11.8-15-12.3-22.1-1.6-43.1-7.1-61.9-15.3 5-10.9 7.3-22.6 7.3-33.7 0-33.7-20.4-76.2-71-83v-5.7c-.1-42.4-34.8-77-77.1-77z"/>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" {...props}>
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/>
  </svg>
);

export const SocialLinks = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Link 
        href="https://web.facebook.com/people/Topreasons-Services/61572973724040/?rdid=pxHOVLXMlhkbbc1a&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1CvMrgnAA1%2F%3F_rdc%3D1%26_rdr" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 rounded-full hover:bg-muted"
        aria-label="Facebook"
      >
        <Facebook className="w-5 h-5" />
      </Link>
      <Link 
        href="https://www.instagram.com/topreasons.services?igsh=YzljYTk1ODg3Zg%3D%3D" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 rounded-full hover:bg-muted"
        aria-label="Instagram"
      >
        <Instagram className="w-5 h-5" />
      </Link>
      <Link 
        href="https://www.snapchat.com/@topreasons?share_id=yIKA6SKx2-k&locale=en-US" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 rounded-full hover:bg-muted"
        aria-label="Snapchat"
      >
        <SnapchatIcon className="w-5 h-5" />
      </Link>
      <Link 
        href="https://www.tiktok.com/@topreasons.services" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 rounded-full hover:bg-muted"
        aria-label="TikTok"
      >
        <TikTokIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};
