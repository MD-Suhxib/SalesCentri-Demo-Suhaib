import Head from 'next/head';

const faqs = [
  {
    question: 'What billing options does Sales Centri offer?',
    answer: 'Sales Centri provides monthly, yearly, and pay-as-you-go billing options to suit different business needs.'
  },
  {
    question: 'How do I upgrade or downgrade my plan?',
    answer: 'You can change your plan anytime from your account dashboard. Upgrades and downgrades are processed instantly.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, Sales Centri pricing is transparent. All fees are clearly listed on our pricing page.'
  },
  {
    question: 'Can I get a refund if I cancel?',
    answer: 'Refunds are available for unused portions of annual plans. Please contact support for details.'
  },
  {
    question: 'How do I get an invoice or receipt?',
    answer: 'Invoices and receipts are automatically generated and available in your account portal after each payment.'
  }
];

export default function BillingFAQPage() {
  return (
    <>
      <Head>
        <title>Billing FAQ | Sales Centri</title>
        <meta name="description" content="Frequently asked questions about Sales Centri billing, pricing, refunds, and invoices." />
      </Head>
      <main className="min-h-screen bg-black text-gray-200 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Billing FAQ</h1>
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
