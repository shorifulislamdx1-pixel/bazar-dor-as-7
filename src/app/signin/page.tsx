"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8f4] text-[#183b2b]">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-lime-100/60 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Page Heading */}
          <div className="mb-7 text-center">
            <Link
              href="/"
              aria-label="বাজার দর হোম"
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-900 text-3xl shadow-lg shadow-emerald-900/15 transition duration-300 hover:-translate-y-1"
            >
              🛒
            </Link>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              স্বাগতম
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              আবার ফিরে আসুন
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              আপনার বাজার দর অ্যাকাউন্টে সাইন ইন করুন।
              <br className="hidden sm:block" />
              প্রতিদিনের বাজারদর জানুন সহজেই।
            </p>
          </div>

          {/* Sign In Card */}
          <form
            onSubmit={handleSignin}
            className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                সাইন ইন করুন
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                আপনার ইমেইল ও পাসওয়ার্ড লিখুন।
              </p>
            </div>

            {/* Email */}
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                ইমেইল ঠিকানা
              </span>

              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-emerald-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoCapitalize="none"
                required
              />
            </label>

            {/* Password */}
            <label className="mb-6 block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                পাসওয়ার্ড
              </span>

              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-emerald-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                autoComplete="current-password"
                required
              />
            </label>

            {/* Submit */}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  সাইন ইন হচ্ছে...
                </>
              ) : (
                <>
                  সাইন ইন করুন
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">
                অথবা সাইন ইন করুন
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social Login */}
            <SocialLoginButtons />

            {/* Sign Up */}
            <p className="mt-6 text-center text-sm text-gray-500">
              নতুন ব্যবহারকারী?{" "}
              <Link
                href="/signup"
                className="font-bold text-emerald-800 underline-offset-4 transition hover:text-emerald-600 hover:underline"
              >
                অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </form>

          {/* Back Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-emerald-800"
            >
              <span aria-hidden="true">←</span>
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-center text-xs text-gray-500 sm:flex-row sm:text-left">
          <p>
            <span className="font-bold text-emerald-900">বাজার দর</span>
            {" "}— প্রতিদিনের বাজারদর, আপনার হাতেই।
          </p>

          <p>সঠিক দাম জানুন, সচেতন থাকুন। 🌿</p>
        </div>
      </footer>
    </div>
  );
}
