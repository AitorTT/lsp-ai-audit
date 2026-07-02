import Link from 'next/link';
import { ArrowRight, Zap, GitBranch, TrendingUp, Shield, Play, CheckCircle, BarChart3, Users, DollarSign } from 'lucide-react';
import { Button, Card, CardHeader, CardContent } from '@lsp/ui';
import RevealOnScroll from '@/components/RevealOnScroll';

const features = [
  { icon: Zap, title: 'AI Readiness Assessment', description: 'Evaluate your organization\'s preparedness for AI integration across people, processes, and technology.' },
  { icon: GitBranch, title: 'Process Optimization', description: 'Identify bottlenecks and streamline your language service workflows for maximum efficiency.' },
  { icon: TrendingUp, title: 'Cost Reduction Analysis', description: 'Uncover cost-saving opportunities through automation and strategic resource reallocation.' },
  { icon: Shield, title: 'Tool Evaluation', description: 'Get unbiased assessments of your current technology stack and recommendations for alternatives.' },
];

const stats = [
  { value: '500+', label: 'Audits Completed', icon: CheckCircle },
  { value: '40%', label: 'Avg. Cost Savings', icon: DollarSign },
  { value: '98%', label: 'Client Satisfaction', icon: Users },
  { value: '15+', label: 'Years Experience', icon: BarChart3 },
];

const services = [
  { title: 'Full Audit', description: 'Comprehensive end-to-end audit covering AI readiness, processes, tooling, and financial analysis.', icon: BarChart3 },
  { title: 'AI Integration', description: 'Focused assessment of your AI adoption strategy with quick wins and integration roadmaps.', icon: Zap },
  { title: 'Process Audit', description: 'Deep dive into operational workflows to eliminate waste and improve quality.', icon: GitBranch },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-950 bg-grid">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container-page relative z-10 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-highlight text-sm text-brand-300 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse-slow" />
              AI-Powered Audits for LSPs
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] animate-fade-up">
              Transform Your{' '}
              <span className="gradient-text">Language Services</span>
              {' '}with AI
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-surface-300 max-w-xl mx-auto animate-fade-up animation-delay-200">
              Data-driven audits that assess AI readiness, optimize operations, reduce costs,
              and evaluate the tools powering your translation business.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4 animate-fade-up animation-delay-300">
              <Link href="/register">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Start Free Audit
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" icon={Play}>
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-surface-400 animate-fade-up animation-delay-400">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent-400" /> No commitment</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent-400" /> 48h turnaround</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent-400" /> Actionable report</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      </section>

      {/* Features */}
      <section className="relative section-padding bg-surface-950">
        <div className="container-page">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Modernize Your{' '}
                <span className="gradient-text">Operations</span>
              </h2>
              <p className="mt-4 text-lg text-surface-400">
                Our audit framework covers every aspect of your language service operations.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <RevealOnScroll key={feature.title} delay={i * 100}>
                <Card className="glass-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-0">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-surface-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container-page relative z-10">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3 opacity-50"><stat.icon size={24} /></div>
                <p className="text-4xl font-bold text-white sm:text-5xl stat-number">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-brand-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-surface-900/50">
        <div className="container-page">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Audit <span className="gradient-text">Packages</span>
              </h2>
              <p className="mt-4 text-lg text-surface-400">
                Choose the scope that fits your organization's needs.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {services.map((service, i) => (
              <RevealOnScroll key={service.title} delay={i * 150}>
                <Card className="glass-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-0 flex flex-col">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                      <service.icon size={24} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{service.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm leading-relaxed text-surface-400">{service.description}</p>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Link href="/services">
                      <Button variant="outline" size="sm" icon={ArrowRight}>
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-surface-950 bg-grid" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[150px]" />

        <div className="container-page relative z-10 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to{' '}
              <span className="gradient-text">Transform</span>
              {' '}Your LSP?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-400">
              Join hundreds of language service providers who have already modernized their operations
              with our AI-driven audit solutions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Start Free Audit
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
