import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-semibold tracking-widest text-neutral-400">
          ERROR 404
        </p>

        <h1 className="mt-4 text-7xl font-bold tracking-tight text-neutral-900">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-neutral-900">
          Page not found
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
