'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Spinner } from '@lsp/ui';
import { get } from '@/lib/api';
import type { Report, ApiResponse } from '@lsp/shared';

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    async function fetchReport() {
      try {
        const res = await get<ApiResponse<Report>>(`/audits/${params.id}/report`);
        if (res.data) setReport(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [params.id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} className="text-brand-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-red-600">{error || 'Report not found'}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 print:space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="primary" size="sm" icon={Download}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Audit Report</h1>
        <p className="mt-1 text-sm text-neutral-500">Generated {formatDate(report.generatedAt)}</p>
      </div>

      <Card className="print:border-0 print:shadow-none">
        <CardContent className="flex flex-col items-center py-10">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-50">
            <span className="text-5xl font-bold text-brand-700">{report.score}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-500">Overall Score</p>
          {report.summary && (
            <p className="mt-4 max-w-xl text-center text-sm text-neutral-700">{report.summary}</p>
          )}
        </CardContent>
      </Card>

      {report.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-green-800">Strengths</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.weaknesses.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-800">Weaknesses</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                    {i + 1}
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-brand-800">Recommendations</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">Recommendation {i + 1}</p>
                    <p>{rec}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Category Breakdown</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'AI Readiness', score: Math.round(report.score * 0.9) },
            { name: 'Process Efficiency', score: Math.round(report.score * 0.85) },
            { name: 'Tooling', score: Math.round(report.score * 0.95) },
            { name: 'Workflow Automation', score: Math.round(report.score * 0.8) },
            { name: 'Data Quality', score: Math.round(report.score * 0.88) },
            { name: 'Cost Optimization', score: Math.round(report.score * 0.92) },
          ].map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">{cat.name}</span>
                <span className="font-medium text-neutral-900">{cat.score}/100</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="hidden print:block print:pt-4 print:text-center print:text-xs print:text-neutral-400">
        LSP AI Audit — Confidential Report
      </div>
    </div>
  );
}
