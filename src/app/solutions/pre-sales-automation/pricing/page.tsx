import { redirect } from 'next/navigation';

export default function PreSalesAutomationPricingRedirect() {
  redirect('/pricing');
  return null;
}

