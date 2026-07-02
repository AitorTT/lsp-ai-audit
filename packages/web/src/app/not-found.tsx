import Link from 'next/link';
import { Button } from '@lsp/ui';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="container-page text-center">
        <p className="text-7xl font-bold text-brand-600 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-neutral-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved
          or no longer exists.
        </p>
        <div className="mt-10">
          <Link href="/">
            <Button variant="primary" size="lg" icon={ArrowLeft}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
