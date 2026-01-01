import Head from 'next/head';

const faqs = [
  {
    question: 'How does Sales Centri use AI for sales automation?',
    answer: 'Sales Centri leverages advanced machine learning models to automate lead generation, contact validation, and sales forecasting, helping teams close deals faster.'
  },
  {
    question: 'Is my data secure with Sales Centri?',
    answer: 'Yes, Sales Centri uses enterprise-grade security protocols, encryption, and compliance standards to keep your data safe.'
  },
  {
    question: 'Can I customize the AI models for my business?',
    answer: 'Sales Centri offers customizable AI workflows and integrations, allowing you to tailor the platform to your unique sales process.'
  },
  {
    question: 'Does Sales Centri support API access?',
    answer: 'Yes, developers can access Sales Centri features via secure APIs for custom integrations and automation.'
  },
  {
    question: 'What technical support is available?',
    answer: 'Our support team is available 24/7 via chat, email, and phone. We also offer extensive documentation and onboarding resources.'
  }
];

export default function TechnicalFAQPage() {
  return (
    <>
      <Head>
        <title>Technical FAQ | Sales Centri</title>
        <meta name="description" content="Technical frequently asked questions about Sales Centri's AI, security, integrations, and developer resources." />
      </Head>
      <main className="min-h-screen bg-black text-gray-200 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Technical FAQ</h1>
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-900/60 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-blue-400 mb-2">{faq.question}</h2>
                <p className="text-gray-300 text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
