import { redirect } from 'next/navigation';

export default function CalendlyPreferencesRedirect() {
  redirect('https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled');
  return null;
}


