import { redirect } from 'next/navigation';

export default function FeatureWalkthroughsRedirect() {
  redirect('/get-started/free-trial/support-resources');
  return null;
}
