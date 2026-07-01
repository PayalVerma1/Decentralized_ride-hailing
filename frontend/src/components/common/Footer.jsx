import { Link } from "react-router-dom";
import { Zap, Globe, ExternalLink, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  Drivers: [
    { name: "Become a Driver", href: "/register/driver" },
    { name: "Driver Dashboard", href: "/driver" },
    { name: "Earnings", href: "/driver/earnings" },
  ],
};

const socialLinks = [
  { icon: ExternalLink, href: "#", label: "Twitter" },
  { icon: Globe, href: "#", label: "GitHub" },
  { icon: ExternalLink, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@ridechain.io", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-text">
                Ride<span className="text-primary">Chain</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
              Secure. Fast. Decentralized Mobility. The future of ride-hailing
              powered by blockchain technology.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted hover:text-text hover:bg-primary/20 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-text mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted hover:text-text transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} RideChain. All rights reserved.
          </p>
          <p className="text-xs text-muted/60">
            Built with blockchain technology for transparent mobility.
          </p>
        </div>
      </div>
    </footer>
  );
}
