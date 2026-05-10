import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a2235] border-t border-[#232d42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span className="text-[#c9a84c] font-semibold tracking-[0.15em] text-sm uppercase">
                Tallinn Tours
              </span>
            </Link>
            <p className="text-[#8892a4] text-sm leading-relaxed max-w-xs">
              Discover Tallinn&apos;s authentic soul. We take you beyond the tourist trail into the
              living, breathing heart of Estonia&apos;s medieval capital.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#232d42] hover:bg-[#c9a84c] text-[#8892a4] hover:text-[#0f1623] transition-all duration-200"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#232d42] hover:bg-[#c9a84c] text-[#8892a4] hover:text-[#0f1623] transition-all duration-200"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* X/Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#232d42] hover:bg-[#c9a84c] text-[#8892a4] hover:text-[#0f1623] transition-all duration-200"
                aria-label="X / Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/tours', label: 'All Tours' },
                { href: '/about', label: 'About Us' },
                { href: '/tours#walking', label: 'Walking Tours' },
                { href: '/tours#history', label: 'History Tours' },
                { href: '/tours#food', label: 'Food Tours' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8892a4] hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Info
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'Privacy Policy' },
                { href: '/about', label: 'Terms of Service' },
                { href: '/about#contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#8892a4] hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-[#8892a4] text-sm">
                <span className="text-white">Email:</span> hello@tallinn-tours.com
              </p>
              <p className="text-[#8892a4] text-sm mt-1">
                <span className="text-white">Phone:</span> +372 555 0100
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#232d42] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#8892a4] text-xs">
            © {new Date().getFullYear()} Tallinn Tours OÜ. All rights reserved.
          </p>
          <p className="text-[#8892a4] text-xs">
            Registered in Estonia · Made with care in Tallinn
          </p>
        </div>
      </div>
    </footer>
  )
}
