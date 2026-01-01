import { redirect } from 'next/navigation';

export default function SupportRequestRedirect() {
  redirect('/');
  return null;
}
