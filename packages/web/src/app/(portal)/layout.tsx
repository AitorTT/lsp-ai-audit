'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ClipboardList, User } from 'lucide-react';
import { Button } from '@lsp/ui';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u.name || u.email || 'User');
      } catch {
        setUserName('User');
      }
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
                A
              </div>
              <span className="text-sm font-semibold text-neutral-900">LSP AI Audit</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/audits"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname?.startsWith('/audits')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <ClipboardList size={16} />
                My Audits
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200">
                <User size={14} />
              </div>
              <span className="hidden sm:inline">{userName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
