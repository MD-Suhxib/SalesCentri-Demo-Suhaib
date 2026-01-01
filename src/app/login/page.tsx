import { redirect } from 'next/navigation';

export default function LoginRedirect() {
  redirect('/login-portal');
  return null;
}


