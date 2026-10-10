"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";

type ProfileUser = {
  name?: string | null;
  email?: string | null;
};

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();

  // Initialize the name directly from the session.
  // No useEffect or setState inside an effect is needed.
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isUnchanged = name.trim() === (user.name ?? "");

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (trimmedName.length > 80) {
      toast.error("নাম সর্বোচ্চ ৮০ অক্ষরের হতে পারবে");
      return;
    }

    if (trimmedName === (user.name ?? "")) {
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "নাম আপডেট করা যায়নি"
        );
        return;
      }

      setName(trimmedName);
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট সফল হয়েছে");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#edf6ed] via-[#f8fbf7] to-[#e5f0e6] px-4 py-10 sm:px-6 sm:py-14">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-xl">
        {/* Back navigation */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#28553a] shadow-sm transition hover:-translate-x-1 hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15 18-6-6 6-6"
            />
          </svg>
          হোম পেজে ফিরে যান
        </Link>

        {/* Profile card */}
        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_25px_80px_-25px_rgba(24,59,43,0.18)] backdrop-blur-xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#183b2b] via-[#24583e] to-[#34744b] px-6 pb-12 pt-9 text-center sm:px-10">
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-white/5" />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15 text-4xl font-extrabold text-white shadow-lg backdrop-blur-sm">
              {user.name?.trim()
                ? user.name.trim().charAt(0).toUpperCase()
                : "👤"}
            </div>

            <h1 className="relative mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              আমার প্রোফাইল
            </h1>

            <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-green-50/80">
              আপনার ব্যক্তিগত তথ্য দেখুন এবং প্রয়োজন অনুযায়ী আপডেট করুন।
            </p>

            <div className="relative mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-50">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              অ্যাকাউন্ট সক্রিয়
            </div>
          </div>

          {/* Form body */}
          <div className="relative -mt-5 rounded-t-[1.75rem] bg-white px-5 pb-7 pt-7 sm:px-9 sm:pb-9">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-[#183b2b]">
                ব্যক্তিগত তথ্য
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                আপনার অ্যাকাউন্টের তথ্য এখান থেকে পরিচালনা করুন।
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  আপনার নাম
                </label>

                <div className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 transition-all duration-200 focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-100/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-focus-within:text-green-700"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 21v-2a7 7 0 0 1 14 0v2"
                    />
                  </svg>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={80}
                    autoComplete="name"
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  সর্বোচ্চ ৮০ অক্ষর
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  ইমেইল ঠিকানা
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5 shrink-0 text-gray-400"
                  >
                    <rect
                      width="18"
                      height="14"
                      x="3"
                      y="5"
                      rx="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 7 9 6 9-6"
                    />
                  </svg>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    autoComplete="email"
                    className="min-w-0 flex-1 cursor-not-allowed bg-transparent py-3.5 text-sm text-gray-500 outline-none"
                  />

                  <span className="shrink-0 rounded-full bg-gray-200/70 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                    অপরিবর্তনীয়
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  আপনার ইমেইল ঠিকানা এখানে পরিবর্তন করা যাবে না।
                </p>
              </div>

              {/* Save button */}
              <button
                type="submit"
                disabled={saving || signingOut || isUnchanged}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#183b2b] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#183b2b]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#24583e] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
              >
                {saving ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
                      />
                    </svg>
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5 transition-transform group-hover:scale-110"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16 6 3 3m-9 9 9-9a2.12 2.12 0 0 0-3-3l-9 9-1 4 4-1Z"
                      />
                    </svg>
                    নাম আপডেট করুন
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs font-medium text-gray-400">
                অ্যাকাউন্ট সেটিংস
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut || saving}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-3.5 text-sm font-bold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signingOut ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 0 1 8-8"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  সাইন আউট হচ্ছে...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                    />
                  </svg>
                  সাইন আউট
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-7 text-center">
              <p className="text-xs leading-6 text-gray-400">
                আপনার অ্যাকাউন্টের তথ্য সুরক্ষিত রাখুন।
                <br />
                কেনাকাটার অভিজ্ঞতা হোক আনন্দময়।
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  return (
    <>
      <Navbar />

      {isPending || !session ? (
        <main className="min-h-screen bg-[#f0f5ef] px-4 py-12">
          <div className="mx-auto max-w-xl animate-pulse">
            <div className="h-5 w-40 rounded bg-green-100" />

            <div className="mt-6 rounded-3xl border border-green-100 bg-white p-8 sm:p-10">
              <div className="mx-auto h-24 w-24 rounded-full bg-green-100" />
              <div className="mx-auto mt-5 h-7 w-48 rounded-lg bg-gray-100" />
              <div className="mx-auto mt-3 h-4 w-64 max-w-full rounded bg-gray-100" />

              <div className="mt-10 space-y-6">
                <div className="h-4 w-24 rounded bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-4 w-24 rounded bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-12 rounded-xl bg-green-100" />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <ProfileForm
          key={session.user.email ?? session.user.name ?? "profile"}
          user={session.user}
        />
      )}
    </>
  );
}
