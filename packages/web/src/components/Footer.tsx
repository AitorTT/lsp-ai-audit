import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const services = [
  'AI Readiness Assessment',
  'Process Optimization',
  'Cost Reduction Analysis',
  'Tool Evaluation',
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-surface-950">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                LSP AI Audit
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-surface-400 max-w-xs">
              Empowering language service providers with AI-driven audit solutions to optimize
              operations, reduce costs, and stay ahead of the competition.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-300">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-300">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {services.map((service, i) => (
                <li key={i}>
                  <Link
                    href="/services"
                    className="text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-300">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-surface-500" />
                <span className="text-sm text-surface-400">hello@lspaiaudit.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-surface-500" />
                <span className="text-sm text-surface-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-surface-500" />
                <span className="text-sm text-surface-400">
                  200 Innovation Drive, Suite 300<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} LSP AI Audit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-surface-500 transition-colors hover:text-surface-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-surface-500 transition-colors hover:text-surface-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
