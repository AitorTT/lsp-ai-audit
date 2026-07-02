'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Calendar, Building2 } from 'lucide-react';
import { Card, CardHeader, CardContent, Badge, Spinner } from '@lsp/ui';
import { get } from '@/lib/api';
import type { PaginatedResponse, Audit } from '@lsp/shared';
import { AuditStatus } from '@lsp/shared';

const statusBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
  [AuditStatus.DRAFT]: 'default',
  [AuditStatus.IN_PROGRESS]: 'info',
  [AuditStatus.REVIEW]: 'warning',
  [AuditStatus.COMPLETED]: 'success',
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardContent>
        <div className="h-5 w-3/4 rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-1/3 rounded bg-neutral-200" />
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-neutral-200" />
          <div className="h-5 w-20 rounded-full bg-neutral-200" />
        </div>
        <div className="mt-3 h-4 w-1/2 rounded bg-neutral-200" />
      </CardContent>
    </Card>
  );
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAudits() {
      try {
        const res = await get<PaginatedResponse<Audit>>('/audits');
        setAudits(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to load audits');
      } finally {
        setLoading(false);
      }
    }
    fetchAudits();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Audits</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText size={48} className="text-neutral-300" />
        <h2 className="mt-4 text-lg font-semibold text-neutral-900">No audits yet</h2>
        <p className="mt-1 text-sm text-neutral-500">Your audits will appear here once they are created.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">My Audits</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit) => (
          <Link key={audit.id} href={`/audits/${audit.id}`}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
              <CardContent>
                <h3 className="text-base font-semibold text-neutral-900">{audit.title}</h3>
                <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
                  <Building2 size={14} />
                  <span>{audit.clientId}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant={statusBadgeVariant[audit.status] || 'default'}>
                    {audit.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar size={12} />
                  <span>
                    {formatDate(audit.startDate)} – {formatDate(audit.endDate)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
