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
  { name: "ডাল", href: "/category/dal", icon: "🌱" },
  { name: "তেল", href: "/category/tel", icon: "🛢️" },
  { name: "সবজি", href: "/category/sobji", icon: "🥬" },
  { name: "মাছ", href: "/category/mach", icon: "🐟" },
  { name: "মাংস", href: "/category/mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", href: "/category/dim-dui", icon: "🥛" },
  { name: "মসলা", href: "/category/moshla", icon: "🌶️" },
];

const formatPrice = (price: number | string | undefined) => {
  const value = Number(price);

  return Number.isFinite(value)
    ? new Intl.NumberFormat("bn-BD").format(value)
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
          weekday: "long",
          day: "numeric",
          month: "long",
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

    const interval = setInterval(updateDateTime, 1000);

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

  return (
    <header className="border-b border-green-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 p-1">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-[#183b2b]">
              বাজার দর
            </h1>

            <p
              className="mt-1 text-[10px] text-gray-500"
              suppressHydrationWarning
            >
              {currentDate}
              {currentTime ? ` • ${currentTime}` : ""}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                className={`max-w-36 truncate rounded-lg border px-3 py-2 text-xs font-semibold transition sm:max-w-48 sm:text-sm ${
                  pathname === "/profile"
                    ? "border-green-700 bg-green-50 text-green-800"
                    : "border-green-200 text-green-800 hover:bg-green-50"
                }`}
              >
                👤 {session.user.name || "প্রোফাইল"}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-lg bg-[#183b2b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                  pathname === "/signin"
                    ? "border-green-700 bg-green-50 text-green-800"
                    : "border-green-200 text-green-800 hover:bg-green-50"
                }`}
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 sm:text-sm ${
                  pathname === "/signup"
                    ? "bg-green-800"
                    : "bg-[#183b2b]"
                }`}
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-y border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-3 sm:px-6">
          <Link
            href="/"
            className={`shrink-0 text-sm transition ${
              pathname === "/"
                ? "font-bold text-green-800"
                : "font-medium text-gray-600 hover:text-green-800"
            }`}
          >
            🏠 হোম
          </Link>

          {categories.map((category) => {
            const active = pathname === category.href;

            return (
              <Link
                key={category.href}
                href={category.href}
                className={`shrink-0 border-b-2 pb-1 text-sm transition ${
                  active
                    ? "border-green-700 font-bold text-green-800"
                    : "border-transparent font-medium text-gray-600 hover:text-green-800"
                }`}
              >
                {category.icon} {category.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {products.length > 0 && (
        <div className="overflow-hidden border-b border-gray-100 bg-[#fbfcfa]">
          <MarqueeText
            duration={18}
            direction="right"
            pauseOnHover={true}
            className="py-2.5"
          >
            {products.map((product, index) => (
              <span
                key={product.id ?? product._id ?? product.slug ?? index}
                className="mx-5 inline-flex items-center gap-2 text-xs"
              >
                <span className="text-gray-500">
                  {product.nameBn || product.name || "পণ্য"}
                </span>

                <span className="font-bold text-gray-800">
                  ৳{formatPrice(product.today)}
                </span>

                <span
                  className={
                    product.change?.dir === "up"
                      ? "text-green-700"
                      : product.change?.dir === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                  }
                >
                  {product.change?.dir === "up"
                    ? "▲"
                    : product.change?.dir === "down"
                      ? "▼"
                      : "—"}{" "}
                  {formatPrice(product.change?.pct ?? 0)}%
                </span>

                <span className="text-gray-300">|</span>
              </span>
            ))}
          </MarqueeText>
        </div>
      )}
    </header>
  );
}
