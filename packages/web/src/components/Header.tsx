'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@lsp/ui';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-surface-950/70 backdrop-blur-2xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-semibold text-white">
            LSP AI Audit
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-surface-400 transition-colors rounded-lg hover:text-white hover:bg-surface-800/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <span className="text-sm font-medium text-surface-400 hover:text-white transition-colors">
              Sign In
            </span>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="flex items-center justify-center md:hidden text-surface-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/[0.04] bg-surface-900/95 backdrop-blur-xl md:hidden animate-fade-in">
          <div className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm font-medium text-surface-400 rounded-lg transition-colors hover:text-white hover:bg-surface-800/50"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.04] my-2 pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="md" className="w-full" icon={ArrowRight}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
