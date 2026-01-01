import Link from 'next/link';

export default function SecurityPolicyPage() {
  const effectiveDate = 'January 1, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Security Policy</h1>
          <p className="text-gray-300">Effective Date: {effectiveDate}</p>
        </div>
      </section>

      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Sales Centri AI LLC (&quot;Sales Centri&quot;, &quot;we&quot;, &quot;us&quot;) is committed to protecting the
            confidentiality, integrity, and availability of customer data through layered technical and
            organizational controls.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Security Program</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Enterprise security program aligned to SOC 2 and ISO 27001 practices</li>
            <li>Dedicated security team with 24/7 monitoring</li>
            <li>Risk management and regular control assessments</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. Data Protection</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
            <li>Key management with strict access controls</li>
            <li>Data segregation and least-privilege access</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Identity & Access Management</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Multi-factor authentication and SSO/SAML support</li>
            <li>Role-based access control with periodic reviews</li>
            <li>Strong password policies and session controls</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Secure Development</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Secure SDLC with code reviews and dependency scanning</li>
            <li>Regular vulnerability scanning and penetration testing</li>
            <li>Change management and deployment controls</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Logging & Monitoring</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Centralized logging and anomaly detection</li>
            <li>Audit trails for administrative and data access events</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Incident Response</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Documented incident response plan with defined SLAs</li>
            <li>Customer notification consistent with applicable laws</li>
            <li>Post-incident reviews and corrective actions</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Business Continuity</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Redundant infrastructure and regular backups</li>
            <li>Disaster recovery testing and RTO/RPO objectives</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">8. Compliance</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We maintain compliance with applicable laws and frameworks including GDPR and CCPA.
            See <Link href="/trust-compliance" className="text-blue-400 hover:text-blue-300 underline">Trust & Compliance</Link> for details.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">9. Contact</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Security inquiries: security@salescentri.com
          </p>
        </div>
      </section>
    </div>
  );
}


