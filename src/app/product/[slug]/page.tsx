import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

export const instant = false;

type MarketPrice = {
  id?: string | number;
  market?: string;
  marketName?: string;
  bazarName?: string;
  name?: string;
  price?: number | string;
  today?: number | string;
  min?: number | string;
  max?: number | string;
  unit?: string;
  location?: string;
  division?: string;
};

type Product = {
  id?: string | number;
  _id?: string;
  slug?: string;
  nameBn?: string;
  name?: string;
  categoryNameBn?: string;
  image?: string;
  unit?: string;
  today?: number | string;
  yesterday?: number | string;
  lastWeek?: number | string;
  lastMonth?: number | string;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number | string;
  };
  description?: string;
  categorySlug?: string;
  markets?: MarketPrice[];
  marketPrices?: MarketPrice[];
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(
      `/signin?next=${encodeURIComponent(`/product/${slug}`)}`,
    );
  }

  let products: Product[];

  try {
    const data = await getProducts();

    if (Array.isArray(data)) {
      products = data;
    } else if (Array.isArray(data?.products)) {
      products = data.products;
    } else if (Array.isArray(data?.data)) {
      products = data.data;
    } else {
      products = [];
    }
  } catch (error) {
    console.error("Product API error:", error);
    throw new Error("পণ্যের তথ্য লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
  }

  const product = products.find(
    (item) =>
      String(item.slug ?? "") === decodedSlug ||
      String(item.id ?? "") === decodedSlug ||
      String(item._id ?? "") === decodedSlug,
  );

  if (!product) {
    notFound();
  }

  const name = product.nameBn || product.name || "পণ্য";
  const unit = unitLabels[product.unit || ""] || product.unit || "একক";

  const today = Number(product.today);
  const price = Number.isFinite(today) ? today : 0;

  const change = Number(product.change?.pct ?? 0);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const rawMarkets = product.markets ?? product.marketPrices ?? [];

  const markets = rawMarkets
    .map((market, index) => {
      const minPrice = Number(
        market.min ?? market.price ?? market.today,
      );

      const maxPrice = Number(
        market.max ?? market.price ?? market.today,
      );

      return {
        ...market,
        rowKey:
          market.id ??
          `${market.market ?? market.marketName ?? "market"}-${index}`,
        displayName:
          market.market ??
          market.marketName ??
          market.bazarName ??
          market.name ??
          market.location ??
          "",
        displayLocation: market.division ?? market.location ?? "",
        minPrice,
        maxPrice,
      };
    })
    .filter(
      (market) =>
        market.displayName.trim() !== "" &&
        Number.isFinite(market.minPrice) &&
        Number.isFinite(market.maxPrice) &&
        market.minPrice > 0 &&
        market.maxPrice > 0,
    );

  const allPrices = markets.flatMap((market) => [
    market.minPrice,
    market.maxPrice,
  ]);

  const minPrice = allPrices.length
    ? Math.min(...allPrices)
    : null;

  const maxPrice = allPrices.length
    ? Math.max(...allPrices)
    : null;

  const avgPrice = allPrices.length
    ? allPrices.reduce((sum, item) => sum + item, 0) /
      allPrices.length
    : null;

  const imageIsUrl = product.image?.startsWith("http") ?? false;

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#183b2b]">
      <Navbar products={products} />

      <main className="px-4 py-7 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-semibold text-green-800 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <section className="mt-5 rounded-2xl border border-[#e4e9df] bg-white p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0f5e9] text-4xl">
                {imageIsUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  product.image || "🛒"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                    {product.categoryNameBn || "পণ্য"}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    প্রতি {unit}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                  {name}
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {product.description ||
                    `${name} এর বর্তমান বাজারদর ও বাজারভিত্তিক দামের তথ্য।`}
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-[#f5f8f2] p-4 sm:min-w-48">
                <p className="text-sm text-gray-500">আজকের দাম</p>

                <p
                  className={`mt-1 text-3xl font-extrabold ${
                    isUp
                      ? "text-green-600"
                      : isDown
                        ? "text-red-600"
                        : "text-[#183b2b]"
                  }`}
                >
                  ৳{formatPrice(price)}
                </p>

                <p
                  className={`mt-2 text-sm font-bold ${
                    isUp
                      ? "text-green-600"
                      : isDown
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                  {formatPrice(Math.abs(change))}%
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-extrabold sm:text-2xl">
              দামের সারসংক্ষেপ
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের ভিত্তিতে
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-red-100 bg-white p-5">
                <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>

                <p className="mt-3 text-2xl font-extrabold text-red-600">
                  {minPrice !== null
                    ? `৳${formatPrice(minPrice)}`
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  প্রতি {unit}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5">
                <p className="text-sm text-gray-500">গড় দাম</p>

                <p className="mt-3 text-2xl font-extrabold text-blue-700">
                  {avgPrice !== null
                    ? `৳${formatPrice(avgPrice)}`
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  প্রতি {unit}
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white p-5">
                <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>

                <p className="mt-3 text-2xl font-extrabold text-green-600">
                  {maxPrice !== null
                    ? `৳${formatPrice(maxPrice)}`
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  প্রতি {unit}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-extrabold sm:text-2xl">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারে {name} এর দাম
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#e4e9df] bg-white">
              {markets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-[#edf4e9]">
                      <tr>
                        <th className="px-5 py-4 font-bold">
                          বাজারের নাম
                        </th>

                        <th className="px-5 py-4 font-bold">
                          এলাকা
                        </th>

                        <th className="px-5 py-4 text-right font-bold">
                          সর্বনিম্ন দাম
                        </th>

                        <th className="px-5 py-4 text-right font-bold">
                          সর্বোচ্চ দাম
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {markets.map((market) => (
                        <tr
                          key={market.rowKey}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4 font-semibold">
                            {market.displayName}
                          </td>

                          <td className="px-5 py-4 text-gray-500">
                            {market.displayLocation || "—"}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-red-600">
                            ৳{formatPrice(market.minPrice)}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-green-600">
                            ৳{formatPrice(market.maxPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <div className="text-3xl">🏪</div>

                  <h3 className="mt-3 font-bold">
                    বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    API থেকে এই পণ্যের বাজারের নাম ও দামের তথ্য পাওয়া যায়নি।
                    API response এবং markets ফিল্ড পরীক্ষা করুন।
                  </p>
                </div>
              )}
            </div>
          </section>

          <p className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            দ্রষ্টব্য: বাজার ও সময়ভেদে পণ্যের দাম পরিবর্তিত হতে পারে।
            প্রদর্শিত তথ্যকে সম্ভাব্য বাজারদর হিসেবে বিবেচনা করুন।
          </p>

          <Link
            href="/#সব-পণ্য"
            className="mt-6 inline-flex rounded-xl bg-[#183b2b] px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e0e9df] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-gray-600 sm:flex-row sm:justify-between">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>

          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </div>
  );
}
