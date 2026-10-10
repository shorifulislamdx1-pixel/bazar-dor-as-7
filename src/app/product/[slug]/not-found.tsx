import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f5ef] px-4">
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-4 text-2xl font-extrabold text-[#183b2b]">
          পণ্য পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          পণ্যটি নেই অথবা ঠিকানা ভুল।
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-xl bg-[#183b2b] px-5 py-3 font-semibold text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}