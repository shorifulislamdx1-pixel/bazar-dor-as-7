
export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-gray-50">
      <div className="border-b bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
          <div className="hidden gap-4 md:flex">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 max-w-full rounded bg-gray-200" />
          <div className="h-4 w-80 max-w-full rounded bg-gray-200" />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              </div>
              <div className="mb-3 h-7 w-28 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
