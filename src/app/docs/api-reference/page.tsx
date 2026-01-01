import Link from 'next/link';

export default function DocsAPIReferencePage() {
	return (
		<div className="min-h-screen bg-black text-gray-200">
			<div className="max-w-4xl mx-auto px-6 py-24">
				<h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
				<p className="text-gray-300 mb-6">
					Developer docs are coming soon. In the meantime, use the resources below.
				</p>
				<ul className="list-disc pl-6 space-y-2 text-gray-300">
					<li>
						<Link className="text-blue-400 hover:underline" href="/get-started/free-trial/support-resources">
							Support Resources
						</Link>
					</li>
					<li>
						<Link className="text-blue-400 hover:underline" href="/get-started/contact/general-questions">
							Contact Support
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
