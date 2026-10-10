"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MarqueeText from "react-marquee-text";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type NavbarProduct = {
  id?: string | number;
  _id?: string;
  slug?: string;
  nameBn?: string;
  name?: string;
  today?: number | string;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number | string;
  };
};

type NavbarProps = {
  products?: NavbarProduct[];
};

const categories = [
  { name: "চাল", href: "/category/chal", icon: "🍚" },
  { name: "ডাল", href: "/category/dal", icon: "🫘" },
  { name: "তেল", href: "/category/tel", icon: "🛢️" },
  { name: "সবজি", href: "/category/sobji", icon: "🥬" },
  { name: "মাছ", href: "/category/mach", icon: "🐟" },
  { name: "মাংস", href: "/category/mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", href: "/category/dim-dui", icon: "🥛" },
  { name: "মসলা", href: "/category/moshla", icon: "🌶️" },
];

const formatPrice = (price: number | string | undefined) => {
  if (price === undefined || price === null || price === "") {
    return "—";
  }

  const value = Number(price);

  return Number.isFinite(value)
    ? new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
      }).format(value)
    : "—";
};

export default function Navbar({ products = [] }: NavbarProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentDate(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(now)
      );

      setCurrentTime(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now)
      );
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 60_000);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setSigningOut(false);
    }
  };

  const isCategoryActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/95 shadow-sm backdrop-blur-md">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="বাজার দর হোম"
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 p-1.5 shadow-sm transition duration-300 group-hover:rotate-3 group-hover:shadow-md">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-emerald-950 sm:text-2xl">
              বাজার দর
            </h1>

            <p
              className="mt-0.5 text-[10px] font-medium text-gray-500 sm:text-xs"
              suppressHydrationWarning
            >
              {currentDate || "বাংলাদেশের বাজার"}
              {currentTime && ` • ${currentTime}`}
            </p>
          </div>
        </Link>

        {/* Authentication */}
        <div className="flex shrink-0 items-center gap-2">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-100" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                title={session.user.name || "প্রোফাইল"}
                className={`flex max-w-36 items-center gap-1.5 truncate rounded-xl border px-3 py-2 text-xs font-semibold transition sm:max-w-48 sm:text-sm ${
                  pathname.startsWith("/profile")
                    ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <span>👤</span>
                <span className="truncate">
                  {session.user.name || "প্রোফাইল"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-xl bg-emerald-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
              >
                {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 sm:px-4 sm:text-sm ${
                  pathname === "/signin"
                    ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                    : "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50"
                }`}
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className={`rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-95 sm:px-4 sm:text-sm ${
                  pathname === "/signup"
                    ? "bg-emerald-700"
                    : "bg-emerald-900 hover:bg-emerald-800"
                }`}
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="border-t border-gray-100 bg-white"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition ${
              pathname === "/"
                ? "bg-emerald-100 font-bold text-emerald-900"
                : "font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
          >
            <span>🏠</span>
            <span>হোম</span>
          </Link>

          {categories.map((category) => {
            const active = isCategoryActive(category.href);

            return (
              <Link
                key={category.href}
                href={category.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-emerald-100 font-bold text-emerald-900"
                    : "font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Live Price Ticker */}
      {products.length > 0 && (
        <div className="border-t border-emerald-100 bg-emerald-50/70">
          <div className="mx-auto flex max-w-7xl items-center">
            <div className="z-10 flex shrink-0 items-center gap-1.5 bg-emerald-800 px-3 py-3 text-xs font-bold text-white shadow-sm sm:px-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
              <span>বাজার আপডেট</span>
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <MarqueeText
                duration={24}
                direction="right"
                pauseOnHover={true}
                className="py-3"
              >
                {products.map((product, index) => {
                  const direction = product.change?.dir;
                  const isUp = direction === "up";
                  const isDown = direction === "down";

                  return (
                    <span
                      key={product.id ?? product._id ?? product.slug ?? index}
                      className="mx-4 inline-flex items-center gap-2 whitespace-nowrap text-xs sm:mx-6 sm:text-sm"
                    >
                      <span className="font-medium text-gray-600">
                        {product.nameBn || product.name || "পণ্য"}
                      </span>

                      <span className="font-bold text-emerald-950">
                        ৳{formatPrice(product.today)}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isUp
                            ? "text-green-700"
                            : isDown
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {isUp ? "▲" : isDown ? "▼" : "—"}
                        {formatPrice(product.change?.pct)}%
                      </span>

                      <span className="text-emerald-200">|</span>
                    </span>
                  );
                })}
              </MarqueeText>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
