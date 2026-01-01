import type { Metadata } from 'next';
import { ContactForm } from '../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sales Centri for sales automation solutions, support, or partnership inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        <ContactForm />
      </div>
    </div>
  );
}
