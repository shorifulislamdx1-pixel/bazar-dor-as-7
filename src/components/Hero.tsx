import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#f0f5ef] px-4 pt-5 sm:px-6 sm:pt-7">
      <div className="relative mx-auto grid max-w-6xl items-center overflow-hidden rounded-[22px] border border-[#e0e9df] bg-[#fbfcfa] px-5 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-[#e1f3e8] px-3 py-1.5 text-xs font-semibold text-green-800">
            🌿 মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#183b2b] sm:text-4xl lg:text-5xl">
            আজকের বাজারের দাম
            <span className="mt-1 block text-green-700">
              এক নজরে
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/#সব-পণ্য"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#008c45] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            সব পণ্য দেখুন
            <span aria-hidden="true">→</span>
          </Link>

           
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-sm md:mt-0">
          <div className="absolute inset-5 rounded-full bg-green-200/60 blur-2xl" />

          <Image
            src="/bazar-hero.png"
            alt="বাজারের তাজা ফল ও সবজি"
            width={700}
            height={600}
            priority
            className="relative z-10 h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
