"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "সাইন আপ করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
      router.push("/signin");
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f5ef] text-[#243329]">
      <Navbar />

      <main className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-md">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="rounded-2xl border border-[#e0e9e0] bg-[#fbfdfb] p-5 shadow-sm sm:p-6"
          >
            <label className="mb-3 block">
              <span className="mb-1.5 block text-sm font-medium">
                নাম
              </span>
              <input
                className="w-full rounded-lg border border-[#dfe8df] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রহিম উদ্দিন"
                autoComplete="name"
                required
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-sm font-medium">
                ইমেইল
              </span>
              <input
                className="w-full rounded-lg border border-[#dfe8df] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-sm font-medium">
                পাসওয়ার্ড
              </span>
              <input
                className="w-full rounded-lg border border-[#dfe8df] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium">
                পাসওয়ার্ড নিশ্চিত করুন
              </span>
              <input
                className="w-full rounded-lg border border-[#dfe8df] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>

            <button
              className="w-full rounded-lg bg-[#07883f] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#067536] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>

            <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
              <div className="h-px flex-1 bg-gray-200" />
              অথবা
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <SocialLoginButtons />

            <p className="mt-4 text-center text-sm">
              অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/signin"
                className="font-semibold text-green-700 hover:underline"
              >
                সাইন ইন করুন
              </Link>
            </p>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-green-700"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#e0e9e0] bg-[#fbfdfb]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>বাজার দর — গ্রাহকবান্ধব বাজারদরের এক নতুন নজির।</p>
          <p>সঠিক দাম সম্পর্কে সচেতন থাকুন।</p>
        </div>
      </footer>
    </div>
  );
}
