export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="mt-2 text-gray-400">This article may be unpublished or the URL is incorrect.</p>
      </div>
    </div>
  );
}


