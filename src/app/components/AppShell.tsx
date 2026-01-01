'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GlobalLenisProvider } from '../providers/GlobalLenisProvider';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

type Props = {
	children: React.ReactNode;
};

export function AppShell({ children }: Props) {
	const pathname = usePathname();
	const excludePrefixes = ['/studio', '/test-research-improvements', '/solutions/psa-suite-one-stop-solution', '/solutions/multi-gpt-aggregated-research', '/multi-gpt-aggregated-research'];
	const isExcluded = excludePrefixes.some((p) => pathname?.startsWith(p));

	// Scroll to top on route change
	useEffect(() => {
		// Scroll to top when pathname changes
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'auto', // Use 'auto' for immediate scroll, or 'smooth' for animated
		});
	}, [pathname]);

	if (isExcluded) {
		return <>{children}</>;
	}

	return (
		<GlobalLenisProvider>
			<Navigation />
			<main className="pt-16">{children}</main>
			<Footer />
		</GlobalLenisProvider>
	);
}


