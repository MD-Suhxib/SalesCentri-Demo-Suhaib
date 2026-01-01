import { redirect } from 'next/navigation';

export default function TrustSecurityPrivacyRedirect() {
  redirect('/legal/security');
  return null;
}
