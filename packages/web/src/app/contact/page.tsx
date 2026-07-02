'use client';

import { type FormEvent, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardContent } from '@lsp/ui';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="section-padding">
        <div className="container-page">
          <Card className="mx-auto max-w-lg text-center py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Send size={32} />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-neutral-900">Thank You!</h1>
            <p className="mt-4 text-neutral-600">
              Your message has been received. We&apos;ll get back to you within one business day.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-20 sm:py-28">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            Ready to transform your LSP? Get in touch and we&apos;ll help you find the right audit
            solution.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-neutral-900">Send Us a Message</h2>
                  <p className="text-sm text-neutral-500">
                    Fill out the form below and our team will respond within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Input label="Full Name" name="name" type="text" placeholder="John Smith" required />
                      <Input label="Email Address" name="email" type="email" placeholder="john@company.com" required />
                    </div>
                    <Input label="Company" name="company" type="text" placeholder="Your Company Ltd." required />
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-sm font-medium text-neutral-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about your LSP and what you're looking for..."
                      />
                    </div>
                    <div>
                      <Button type="submit" variant="primary" size="lg" icon={Send}>
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardContent className="flex flex-col gap-6 py-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">Email</h3>
                      <p className="mt-1 text-sm text-neutral-600">hello@lspaiaudit.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">Phone</h3>
                      <p className="mt-1 text-sm text-neutral-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">Office</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        200 Innovation Drive, Suite 300<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">Hours</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        Mon&ndash;Fri: 9:00 AM &ndash; 6:00 PM PST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-8">
                  <h3 className="text-sm font-semibold text-neutral-900">Response Time</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    We typically respond to all inquiries within one business day. For urgent matters,
                    please indicate so in your message subject.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
