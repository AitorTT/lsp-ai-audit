'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Building2, FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardContent, Badge, Button, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@lsp/ui';
import { get } from '@/lib/api';
import type { Audit, Report, ApiResponse } from '@lsp/shared';
import { AuditStatus } from '@lsp/shared';

const statusBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
  [AuditStatus.DRAFT]: 'default',
  [AuditStatus.IN_PROGRESS]: 'info',
  [AuditStatus.REVIEW]: 'warning',
  [AuditStatus.COMPLETED]: 'success',
};

const severityBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  CRITICAL: 'danger',
  HIGH: 'warning',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'default',
};

const severityColors: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  INFO: 'bg-neutral-100 text-neutral-800 border-neutral-200',
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    async function fetchData() {
      try {
        const auditRes = await get<ApiResponse<Audit>>(`/audits/${params.id}`);
        if (auditRes.data) setAudit(auditRes.data);
        const reportRes = await get<ApiResponse<Report>>(`/audits/${params.id}/report`).catch(() => null);
        if (reportRes?.data) setReport(reportRes.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to load audit');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} className="text-brand-600" />
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-red-600">{error || 'Audit not found'}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">{audit.title}</h1>
            <Badge variant={statusBadgeVariant[audit.status] || 'default'}>
              {audit.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
            <Building2 size={14} />
            <span>{audit.clientId}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-neutral-900">Overview</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-neutral-500">Scope</p>
              <p className="text-sm text-neutral-900">{audit.scope.replace(/_/g, ' ')}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-xs font-medium text-neutral-500">Start Date</p>
                <div className="flex items-center gap-1 text-sm text-neutral-900">
                  <Calendar size={12} />
                  {formatDate(audit.startDate)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">End Date</p>
                <div className="flex items-center gap-1 text-sm text-neutral-900">
                  <Calendar size={12} />
                  {formatDate(audit.endDate)}
                </div>
              </div>
            </div>
            {audit.description && (
              <div>
                <p className="text-xs font-medium text-neutral-500">Description</p>
                <p className="text-sm text-neutral-700">{audit.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {report && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-neutral-900">Report Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-700">
                  {report.score}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Overall Score</p>
                  <p className="text-sm text-neutral-700">{report.summary}</p>
                </div>
              </div>
              {report.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700">Strengths</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-neutral-700">
                    {report.strengths.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                    {report.strengths.length > 3 && (
                      <li className="list-none text-xs text-neutral-400">
                        +{report.strengths.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <Link href={`/audits/${audit.id}/report`}>
                <Button variant="primary" size="sm" icon={FileText}>
                  View Full Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-neutral-900">Findings ({audit.findings.length})</h2>
        </CardHeader>
        <CardContent>
          {audit.findings.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-400">No findings recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audit.findings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-medium text-neutral-900">{finding.title}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          severityColors[finding.severity] || severityColors.INFO
                        }`}
                      >
                        {finding.severity}
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {finding.category.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell className="text-neutral-600">{finding.impact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-neutral-900">Recommendations</h2>
          </CardHeader>
          <CardContent>
            {report.recommendations.length === 0 ? (
              <p className="text-sm text-neutral-400">No recommendations yet.</p>
            ) : (
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <div className="border-t border-neutral-100 px-6 py-4">
            <Button variant="outline" size="sm" icon={Download}>
              Download Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return [];
}
