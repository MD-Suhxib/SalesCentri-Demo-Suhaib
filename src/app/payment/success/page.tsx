type SearchParams = {
  txnid?: string | string[];
  status?: string | string[];
  verified?: string | string[];
};

function parseParam(value?: string | string[], fallback = ''): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const txnid = parseParam(params.txnid);
  const status = parseParam(params.status, 'success');
  const verified = parseParam(params.verified, 'true') !== 'false';

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold">Payment Successful</h1>
        <p className="text-sm text-gray-300">
          Thank you for completing your payment. We&apos;ve received the
          confirmation from PayU{verified ? '' : ', but we could not verify the hash' }.
        </p>

        <div className="bg-gray-800/60 rounded-xl p-4 text-left space-y-2">
          {txnid ? (
            <p className="text-xs text-gray-400">
              <span className="text-gray-500">Transaction ID:</span>{' '}
              <span className="text-gray-200">{txnid}</span>
            </p>
          ) : null}
          <p className="text-xs text-gray-400">
            <span className="text-gray-500">Status:</span>{' '}
            <span className="text-gray-200">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            <span className="text-gray-500">Verified:</span>{' '}
            <span className="text-gray-200">{verified ? 'Yes' : 'No'}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <a
            href="/get-started/book-demo"
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors"
          >
            Book Meeting
          </a>
          <a
            href="/"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-700 text-gray-200 text-sm hover:bg-gray-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}

