'use client';

import { useState } from 'react';
import Link from 'next/link';

const shopLinks = [
  { label: 'Phone Cases', href: '/products/cases' },
  { label: 'AirPods Cases', href: '/products/airpods' },
  { label: 'Chargers', href: '/products/chargers' },
  { label: 'Cables', href: '/products/cables' },
  { label: 'Screen Protectors', href: '/products/screen-protectors' },
  { label: 'MagSafe Accessories', href: '/products/magsafe' },
];

const supportLinks = [
  { label: 'FAQ', href: '/support/faq' },
  { label: 'Shipping & Returns', href: '/support/shipping-returns' },
  { label: 'Warranty', href: '/support/warranty' },
  { label: 'Contact Us', href: '/support/contact' },
  { label: 'Track Order', href: '/support/track-order' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-bg-elevated">
      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4">
        {/* Column 1 — Brand */}
        <div className="md:col-span-1">
          <Link
            href="/"
            className="font-serif-display text-lg font-bold tracking-[0.2em] text-text-primary"
          >
            AVENOIR
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Premium tech accessories designed for everyday protection. Minimal,
            durable, made for your device.
          </p>

          {/* Social links */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 12V7a7 7 0 0 1 14 0v5a5 5 0 0 1-10 0V7a3 3 0 0 1 6 0v5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2 — Shop */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-text-primary">Shop</h4>
          <ul className="flex flex-col gap-2.5">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Support */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-text-primary">
            Support
          </h4>
          <ul className="flex flex-col gap-2.5">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Newsletter */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-text-primary">
            Newsletter
          </h4>
          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Be the first to hear about new arrivals, exclusive offers, and
            styling inspiration.
          </p>

          {subscribed ? (
            <p className="text-sm font-medium text-accent-primary">
              Thank you for subscribing ✦
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-border-subtle bg-bg-base px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition-colors focus:border-accent-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-text-secondary sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Avenoir. All rights reserved.</p>
          <p>Visa &bull; Mastercard &bull; Apple Pay &bull; Google Pay</p>
        </div>
      </div>
    </footer>
  );
}
