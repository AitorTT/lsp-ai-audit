import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Card, CardHeader, CardContent } from '@lsp/ui';

const auditServices = [
  {
    title: 'Full Audit',
    subtitle: 'Comprehensive transformation assessment',
    description:
      'Our most thorough engagement. We evaluate every facet of your LSP operations including AI readiness, process efficiency, technology stack, and financial performance. You receive a prioritized roadmap with actionable recommendations, implementation timelines, and projected ROI.',
    highlights: [
      'End-to-end operational analysis',
      'AI readiness score and benchmarks',
      'Process efficiency mapping',
      'Technology stack evaluation',
      'Financial impact projections',
      '60-page detailed report',
    ],
  },
  {
    title: 'AI Integration Audit',
    subtitle: 'Focused AI adoption strategy',
    description:
      'Designed for LSPs already exploring AI or looking to accelerate their adoption. We assess your current AI initiatives, identify gaps, evaluate vendor solutions, and build a phased integration roadmap aligned with your business goals.',
    highlights: [
      'Current AI maturity assessment',
      'Vendor solution comparison',
      'Integration roadmap',
      'Risk and compliance review',
      'Training needs analysis',
      'Quick-win identification',
    ],
  },
  {
    title: 'Process Audit',
    subtitle: 'Operational efficiency deep dive',
    description:
      'A deep dive into your day-to-day workflows. We analyze project management, vendor onboarding, quality assurance, delivery pipelines, and client communication to eliminate bottlenecks and reduce turnaround times.',
    highlights: [
      'Workflow mapping and analysis',
      'Bottleneck identification',
      'Automation opportunities',
      'Quality assurance review',
      'Turnaround time reduction',
      'Best practice recommendations',
    ],
  },
  {
    title: 'Tool Assessment',
    subtitle: 'Technology stack evaluation',
    description:
      'An unbiased review of your current technology investments. We evaluate CAT tools, TMS platforms, MT engines, QA software, and emerging AI solutions to ensure you have the right tools for your specific needs.',
    highlights: [
      'Tool utilization analysis',
      'License cost optimization',
      'Integration assessment',
      'Feature gap analysis',
      'Vendor comparison matrix',
      'Replacement recommendations',
    ],
  },
  {
    title: 'Cost Analysis',
    subtitle: 'Financial optimization audit',
    description:
      'Focus on your bottom line. We analyze your cost structure across technology, operations, and human resources to identify savings opportunities through automation, process improvements, and strategic resource allocation.',
    highlights: [
      'Cost structure breakdown',
      'Automation savings calculation',
      'Resource optimization',
      'Technology cost audit',
      'Vendor contract review',
      'Multi-year savings projection',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-20 sm:py-28">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Audit Services
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            Flexible audit packages designed to meet your LSP wherever you are in your AI journey.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-12">
            {auditServices.map((service) => (
              <Card key={service.title} className="overflow-hidden">
                <div className="grid lg:grid-cols-5">
                  <div className="lg:col-span-3">
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-neutral-900">{service.title}</h2>
                      <p className="text-sm font-medium text-brand-600">{service.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-neutral-600">
                        {service.description}
                      </p>
                      <div className="mt-6">
                        <Link href="/contact">
                          <Button variant="primary" size="md" icon={ArrowRight}>
                            Request This Audit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                  <div className="bg-neutral-50 p-6 lg:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                      What&apos;s Included
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-500" />
                          <span className="text-sm text-neutral-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-16 sm:py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-white">
            Not Sure Which Audit You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
            Contact us for a free consultation. We&apos;ll help you identify the right audit scope
            for your organization&apos;s goals.
          </p>
          <div className="mt-10">
            <Link href="/contact">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
