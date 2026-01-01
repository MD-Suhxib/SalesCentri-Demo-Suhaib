import { redirect } from 'next/navigation';

export default function SDRServiceRedirect() {
  redirect('/');
  return null;
}
