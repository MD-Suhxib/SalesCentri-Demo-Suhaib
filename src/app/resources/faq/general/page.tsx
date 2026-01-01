import Head from 'next/head';

const faqs = [
  {
    question: 'What is Sales Centri and how does it help my business?',
    answer: 'Sales Centri is an AI-powered sales automation platform designed to help businesses generate leads, validate contacts, and optimize sales processes. It streamlines workflows and increases conversion rates.'
  },
  {
    question: 'Who can use Sales Centri?',
    answer: 'Sales Centri is ideal for sales teams, marketing professionals, business owners, and anyone looking to improve their sales efficiency and results.'
  },
  {
    question: 'Is Sales Centri suitable for small businesses?',
    answer: 'Absolutely! Sales Centri offers flexible plans and pay-as-you-go options, making it accessible for startups and small businesses.'
  },
  {
    question: 'How do I get started with Sales Centri?',
    answer: 'You can start with a free trial by signing up on our website. No credit card required.'
  },
  {
    question: 'Can I integrate Sales Centri with my existing CRM?',
    answer: 'Yes, Sales Centri supports integrations with popular CRMs and other sales tools.'
  }
];

export default function GeneralFAQPage() {
  return (
    <>
      <Head>
        <title>General FAQ | Sales Centri</title>
        <meta name="description" content="Frequently asked questions about Sales Centri's sales automation platform, features, and getting started." />
      </Head>
      <main className="min-h-screen bg-black text-gray-200 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">General FAQ</h1>
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
