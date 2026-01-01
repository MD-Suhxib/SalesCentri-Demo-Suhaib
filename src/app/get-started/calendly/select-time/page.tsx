import { redirect } from 'next/navigation';

export default function CalendlySelectTimeRedirect() {
  redirect('https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled');
  return null;
}


