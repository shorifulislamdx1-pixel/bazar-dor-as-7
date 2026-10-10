import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf7ef] via-[#f8fbf7] to-[#e4f0e6] px-4 py-10">
      {/* Background decorations */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-8 text-center shadow-[0_25px_80px_-25px_rgba(24,59,43,0.2)] backdrop-blur-xl sm:p-10">
        {/* Icon */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#e5f4e8] to-[#cce8d2] shadow-inner">
          <div className="absolute inset-2 rounded-full border border-white/80" />
          <span className="animate-bounce text-6xl [animation-duration:2.5s]">
            🛒
          </span>

          <span className="absolute -right-1 top-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-rose-100 text-lg">
            !
          </span>
        </div>

        {/* Error code */}
        <p className="mt-7 inline-flex rounded-full bg-[#edf6ef] px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#39714d]">
          ERROR 404
        </p>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#183b2b] sm:text-4xl">
          পণ্য পাওয়া যায়নি!
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-gray-500 sm:text-base">
          দুঃখিত! আপনি যে পণ্যটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          পণ্যটি সরানো হয়েছে অথবা লিংকটি ভুল হতে পারে।
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#183b2b] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#183b2b]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#24583e] hover:shadow-xl active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15 18-6-6 6-6M9 12h12"
              />
            </svg>
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce9df] bg-white px-6 py-3 font-semibold text-[#28553a] transition-all duration-300 hover:border-[#9dc5a6] hover:bg-[#f4faf5]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path
                strokeLinecap="round"
                d="m16 16 4 4M8 11h6"
              />
            </svg>
            আরও পণ্য দেখুন
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400">
            আপনার কেনাকাটার অভিজ্ঞতা হোক আনন্দময়
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#39714d]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            আমরা সবসময় আপনার পাশে
          </div>
        </div>
      </div>
    </main>
  );
}
