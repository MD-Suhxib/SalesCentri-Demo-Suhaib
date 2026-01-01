import Link from 'next/link';

export default function CookiePolicyPage() {
  const effectiveDate = 'January 1, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-300">Effective Date: {effectiveDate}</p>
        </div>
      </section>

      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <p className="text-gray-300 mb-6 leading-relaxed">
            This Cookie Policy explains how Sales Centri AI LLC (&quot;Sales Centri&quot;, &quot;we&quot;, &quot;us&quot;) uses cookies
            and similar technologies on our websites and services.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. What Are Cookies?</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Cookies are small text files placed on your device to store data that can be read by a web server
            in the domain that placed the cookie. Other technologies, including web beacons and local storage,
            may be used for similar purposes.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. How We Use Cookies</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Essential: sign-in, security, load balancing</li>
            <li>Preferences: remembers settings like language and UI choices</li>
            <li>Analytics: usage metrics to improve our Services</li>
            <li>Performance: helps measure site performance and reliability</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Third-Party Cookies</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may use third-party analytics and service providers who set cookies on our behalf (e.g., for
            analytics, error monitoring). These providers have their own privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Your Choices</h2>
          <ul className="text-gray-300 mb-6 leading-relaxed space-y-2 ml-6">
            <li>Browser Controls: block or delete cookies in your browser settings</li>
            <li>Consent Tools: where required, we provide consent banners or preference centers</li>
            <li>Opt-Outs: disable analytics via provider opt-outs, if available</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Do Not Track</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We do not respond to Do Not Track (DNT) signals at this time.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Changes</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may update this Cookie Policy from time to time. Changes will be posted with an updated
            effective date.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Contact</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Email: privacy@salescentri.com
          </p>

          <p className="text-gray-300 mb-6 leading-relaxed">
            For more information on how we handle personal data, see our <Link href="/legal/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}


