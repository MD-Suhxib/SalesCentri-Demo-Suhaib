import { redirect } from 'next/navigation';

export default function TrustPrivacyRedirect() {
  redirect('/legal/privacy');
  return null;
}


