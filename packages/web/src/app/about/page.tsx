import { Card, CardContent } from '@lsp/ui';
import { Target, Eye, Heart } from 'lucide-react';

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', bio: '15 years in language services and AI strategy.' },
  { name: 'Marcus Johnson', role: 'CTO & Co-Founder', bio: 'Former engineering lead at major AI platforms.' },
  { name: 'Elena Rodriguez', role: 'Head of Audits', bio: 'Certified process optimization expert with LSP specialization.' },
  { name: 'David Kim', role: 'Head of Client Success', bio: 'Ensuring every client gets maximum value from their audit.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-20 sm:py-28">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            About LSP AI Audit
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            We help language service providers harness the power of AI through comprehensive,
            unbiased audits that drive real business results.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-neutral-900">Our Story</h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600">
              Founded in 2020, LSP AI Audit was born from a simple observation: language service
              providers were being inundated with AI tools and promises, but lacked the objective
              framework needed to make informed decisions. Our founders&mdash;veterans of both the
              language services and AI industries&mdash;set out to create an audit methodology that
              cuts through the noise and delivers actionable insights.
            </p>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Today, we have completed over 500 audits for LSPs ranging from boutique translation
              agencies to global interpretation firms. Our proprietary audit framework combines
              industry best practices with cutting-edge AI assessment methodologies to provide a
              complete picture of your organization&apos;s opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Our Mission &amp; Values</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Target size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">Mission</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Democratize AI audit expertise for language service providers of all sizes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Eye size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">Vision</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  A world where every LSP can confidently navigate the AI transformation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Heart size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">Values</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Objectivity, transparency, and measurable outcomes in every engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Our Team</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Experienced professionals dedicated to your success.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{member.name}</h3>
                  <p className="text-sm font-medium text-brand-600">{member.role}</p>
                  <p className="mt-2 text-sm text-neutral-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
