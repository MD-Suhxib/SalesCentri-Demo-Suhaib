import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const effectiveDate = 'January 1, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Effective Date: {effectiveDate}</p>
        </div>
      </section>

      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <p className="text-gray-300 mb-6 leading-relaxed">
            This Privacy Policy explains how Sales Centri AI LLC (&quot;Sales Centri&quot;, &quot;we&quot;, &quot;us&quot;) collects,
            uses, discloses, and safeguards personal information when you use our websites, products, and
            services (collectively, the &quot;Services&quot;).
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Information We Collect</h2>
                      <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>
              Account and Contact Information: name, email address, phone, company, role, and credentials you
              provide during signup, demos, or support interactions.
            </li>
            <li>
              Usage Data: log data, IP address, device identifiers, browser type, pages visited, and
              interactions with our Services.
            </li>
            <li>
              Payment and Billing: billing address, transaction details (processed by trusted third-party
              processors; we do not store full payment card numbers).
            </li>
            <li>
              Customer Content: data you upload or generate when using our Services.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. How We Use Information</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Provide, operate, and improve the Services</li>
            <li>Personalize features and recommendations</li>
            <li>Communicate with you about updates, security, and support</li>
            <li>Process payments and fulfill transactions</li>
            <li>Detect, prevent, and investigate fraud, abuse, or security incidents</li>
            <li>Comply with legal obligations and enforce our Terms</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Legal Bases for Processing (EEA/UK)</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We process personal data based on consent, contract necessity, legitimate interests (e.g., product
            improvement, security), and legal obligations.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Sharing and Disclosure</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>
              Service Providers: we share data with vendors who perform services on our behalf (e.g., hosting,
              analytics, support, payments) under confidentiality and data protection obligations.
            </li>
            <li>Legal and Safety: to comply with law or protect rights, property, and safety.</li>
            <li>Business Transfers: in connection with mergers, acquisitions, or asset sales.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. International Transfers</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may transfer, store, and process information in countries outside your own. Where required, we
            use appropriate safeguards such as Standard Contractual Clauses.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Data Retention</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We retain information for as long as necessary to provide the Services, comply with legal
            obligations, resolve disputes, and enforce agreements.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Your Rights</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Access, correction, deletion, and portability</li>
            <li>Object to or restrict processing where applicable</li>
            <li>Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p className="text-gray-300 mb-6 leading-relaxed">
            To exercise your rights, contact us at privacy@salescentri.com.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">8. Security</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We employ technical and organizational measures appropriate to the risk, including encryption in
            transit and at rest, access controls, and regular security assessments. Learn more on our
            <Link href="/trust-compliance" className="text-blue-400 hover:text-blue-300 underline"> Trust & Compliance</Link> page.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">9. Cookies and Tracking</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We use cookies and similar technologies. See our <Link href="/legal/cookies" className="text-blue-400 hover:text-blue-300 underline">Cookie Policy</Link> for details.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">10. Children&apos;s Privacy</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Our Services are not intended for children under 16. We do not knowingly collect personal
            information from children under 16.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">11. Changes to This Policy</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may update this Privacy Policy. We will notify you of material changes via email or in-app
            notification.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">12. Contact Us</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Questions about this Privacy Policy? Contact us at privacy@salescentri.com or by mail at our
            corporate address.
          </p>
        </div>
      </section>
    </div>
  );
}


