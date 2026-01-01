import { redirect } from 'next/navigation';

export default function PSASuiteOverviewRedirect() {
  redirect('/solutions/psa-suite-one-stop-solution');
  return null;
}
