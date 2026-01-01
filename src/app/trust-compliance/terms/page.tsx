import { redirect } from 'next/navigation';

export default function TrustTermsRedirect() {
  redirect('/legal/terms');
  return null;
}


