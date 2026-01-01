import { redirect } from 'next/navigation';

export default function CalendlyRedirect() {
  redirect('https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled');
  return null;
}
