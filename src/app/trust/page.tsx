import { redirect } from 'next/navigation';

export default function TrustRedirect() {
  redirect('/trust-compliance');
  return null;
}


