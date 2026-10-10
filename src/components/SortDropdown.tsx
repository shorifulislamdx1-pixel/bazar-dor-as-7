
"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  slug: string;
  sort?: string;
};

export default function SortDropdown({ slug, sort }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    sort === "low"
      ? "দাম কম–বেশি"
      : sort === "high"
        ? "দাম বেশি–কম"
        : "ডিফল্ট";

  const options = [
    { label: "ডিফল্ট", href: `/category/${slug}`, value: "" },
    {
      label: "দাম কম–বেশি",
      href: `/category/${slug}?sort=low`,
      value: "low",
    },
    {
      label: "দাম বেশি–কম",
      href: `/category/${slug}?sort=high`,
      value: "high",
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex min-w-44 items-center justify-between gap-4 rounded-xl border border-[#dce6d9] bg-white px-4 py-3 text-sm font-semibold text-[#183b2b] shadow-sm transition hover:bg-[#f7faf5]"
      >
        {selectedLabel}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Dropdown বন্ধ করুন"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[#e2e9e1] bg-white p-1.5 shadow-lg">
            {options.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  sort === option.value
                    ? "bg-[#eaf3e5] font-bold text-[#183b2b]"
                    : "text-gray-700 hover:bg-[#f1f7e9]"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
