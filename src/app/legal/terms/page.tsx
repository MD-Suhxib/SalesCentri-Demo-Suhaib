import Link from 'next/link';

export default function TermsOfServicePage() {
  const effectiveDate = 'January 1, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-300">Effective Date: {effectiveDate}</p>
        </div>
      </section>

      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <p className="text-gray-300 mb-6 leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the websites, products,
            and services provided by Sales Centri AI LLC (&quot;Sales Centri&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By
            accessing or using our services, you agree to be bound by these Terms. If you do not agree,
            do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Who We Are</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Sales Centri AI LLC, 1309 Coffeen Avenue, STE 1200, Sheridan, Wyoming 82801, United States.
            Registered office: 1209 Orange Street, Wilmington, Delaware 19801, United States.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. Eligibility</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You must be at least 18 years old and have the authority to enter into these Terms. If you
            are using the services on behalf of an organization, you represent and warrant that you have
            authority to bind that organization to these Terms.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Accounts and Security</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activities that occur under your account. You must promptly notify us of any unauthorized
            access or suspected security incident.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Acceptable Use</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You agree not to misuse the services or help anyone else do so. Prohibited activities include
            illegal activity, infringing others&apos; rights, interfering with the services&apos; operation, reverse
            engineering or scraping where prohibited, and bypassing rate limits or security controls.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Customer Data and Privacy</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Our use of personal data is described in our <Link href="/legal/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>.
            If you are an enterprise customer, our Data Processing Agreement (DPA) may also apply.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Intellectual Property</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We retain all rights, title, and interest in and to the services, including software, content,
            and trademarks. You may not use our marks or copy, modify, or create derivative works except as
            expressly permitted by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Feedback</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You may provide feedback or suggestions. You grant us a non-exclusive, worldwide, perpetual,
            irrevocable, royalty-free license to use and incorporate feedback without restriction.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">8. Third-Party Services</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Our services may interoperate with third-party services. We are not responsible for third-party
            services and disclaim all liability arising from your use of them.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">9. Beta Features</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may offer beta or pre-release features. These are provided &quot;as is&quot; without warranties and
            may be changed or discontinued at any time.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">10. Fees and Payment</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Paid features are billed according to the plan selected. You authorize us and our payment
            processors to charge your payment method. Fees are non-refundable except as required by law or
            expressly stated in an order form.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">11. Term, Suspension, and Termination</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may suspend or terminate your access if you breach these Terms, create risk or legal exposure
            for us, or for planned maintenance. You may stop using the services at any time. Sections that by
            their nature should survive termination will survive.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">12. Warranties and Disclaimers</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; WE DISCLAIM ALL WARRANTIES, EXPRESS OR
            IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">13. Limitation of Liability</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SALES CENTRI AND ITS AFFILIATES WILL NOT BE LIABLE FOR
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES; OR ANY LOSS OF
            PROFITS, REVENUE, DATA, OR GOODWILL. OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE
            SERVICES SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO US IN THE 12 MONTHS PRECEDING THE EVENT.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">14. Indemnification</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You will indemnify and hold Sales Centri, its affiliates, and personnel harmless from any claims,
            losses, and expenses arising from your use of the services, your content, or your violation of
            these Terms or applicable law.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">15. Compliance and Export</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You must comply with all applicable laws, including export controls and sanctions. You may not
            use the services in or for the benefit of embargoed countries or prohibited end users.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">16. Dispute Resolution; Governing Law</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            These Terms are governed by the laws of the State of Delaware, USA, without regard to conflicts
            of law principles. The parties consent to exclusive jurisdiction and venue in Delaware courts.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">17. Changes to These Terms</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may update these Terms from time to time. We will post the updated Terms with an updated
            effective date. Your continued use constitutes acceptance.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">18. Contact</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Questions? Contact us at info@salescentri.com or by mail at our corporate address above.
          </p>
        </div>
      </section>
    </div>
  );
}


