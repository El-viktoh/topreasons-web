import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-card border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/assets/logo.png" alt="Top Reasons" className="h-8" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ghana's trusted car rental service — quality vehicles, affordable rates, reliable service.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs text-primary">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/cars" className="text-muted-foreground hover:text-foreground transition-colors">Car Rental</Link></li>
              <li><Link href="/cars" className="text-muted-foreground hover:text-foreground transition-colors">Airport Transfers</Link></li>
              <li><Link href="/apartments" className="text-muted-foreground hover:text-foreground transition-colors">Places to Stay</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Business Accounts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs text-primary">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs text-primary">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><span className="text-muted-foreground">support@topreasons.com</span></li>
              <li><span className="text-muted-foreground">Accra, Ghana</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Top Reasons Car Rentals. All rights reserved. Ghana.</p>
        </div>
      </div>
    </footer>
  );
};
