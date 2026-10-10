"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SocialLoginButtons() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  async function handleSocialLogin(provider: "google" | "github") {
    if (loading !== null) return;

    setLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
      });

      if (result?.error) {
        toast.error(
          result.error.message || "লগইন করা যায়নি। আবার চেষ্টা করুন।"
        );
        setLoading(null);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(null);
    }
  }

  return (
    <div className="mt-5 space-y-3">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg font-extrabold text-blue-600">G</span>
        {loading === "google"
          ? "Google-এ সংযোগ হচ্ছে..."
          : "Google দিয়ে লগইন"}
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin("github")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-[#18181b] px-4 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg">●</span>
        {loading === "github"
          ? "GitHub-এ সংযোগ হচ্ছে..."
          : "GitHub দিয়ে লগইন"}
      </button>
    </div>
  );
}
