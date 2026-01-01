import Link from 'next/link';

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Legal</h1>
          <p className="text-gray-300 max-w-3xl">Find our legal terms, privacy commitments, and security practices in one place.</p>
        </div>
      </section>

      <section className="relative pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[ 
            { title: 'Terms of Service', description: 'The rules and conditions for using our services', href: '/legal/terms' },
            { title: 'Privacy Policy', description: 'How we collect, use, and protect personal data', href: '/legal/privacy' },
            { title: 'Cookie Policy', description: 'Our use of cookies and similar technologies', href: '/legal/cookies' },
            { title: 'Security Policy', description: 'Controls and practices that safeguard your data', href: '/legal/security' },
            { title: 'Trust & Compliance', description: 'Certifications and compliance overview', href: '/trust-compliance' },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div className="h-full bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


