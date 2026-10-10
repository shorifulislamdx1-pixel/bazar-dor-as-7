"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(result.error.message || "নাম আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="min-h-screen bg-[#f0f5ef]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f0f5ef] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-xl">
          <Link
            href="/"
            className="text-sm font-semibold text-green-800 hover:text-green-600"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <section className="mt-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-9">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                👤
              </div>

              <h1 className="mt-4 text-2xl font-extrabold text-[#183b2b]">
                আমার প্রোফাইল
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                আপনার অ্যাকাউন্টের তথ্য দেখুন ও পরিবর্তন করুন।
              </p>
            </div>

            <form onSubmit={handleUpdate} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  আপনার নাম
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  ইমেইল
                </label>

                <input
                  id="email"
                  type="email"
                  value={session.user.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving || name.trim() === session.user.name}
                className="w-full rounded-xl bg-[#183b2b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
              </button>
            </form>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={async () => {
                  const result = await authClient.signOut();

                  if (result.error) {
                    toast.error("সাইন আউট করা যায়নি");
                    return;
                  }

                  toast.success("সাইন আউট হয়েছে");
                  router.replace("/");
                  router.refresh();
                }}
                className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                সাইন আউট
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}