import { redirect } from 'next/navigation';

export default function PlatformsIndexRedirect() {
  redirect('/platforms/contact-intelligence');
  return null;
}


