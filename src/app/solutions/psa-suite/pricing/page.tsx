import { redirect } from 'next/navigation';

export default function PSASuitePricingRedirect() {
  redirect('/solutions/psa-suite-one-stop-solution');
  return null;
}
