import { getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const instant = false;

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
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number | string;
  };
};

const formatPrice = (price: number | string | undefined) => {
  const value = Number(price);
  return Number.isFinite(value)
    ? new Intl.NumberFormat("bn-BD").format(value)
    : "—";
};

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function getProductSlug(product: Product) {
  return product.slug || "";
}

function ProductLinkCard({
  product,
  compact = false,
  isLoggedIn,
}: {
  product: Product;
  compact?: boolean;
  isLoggedIn: boolean;
}) {
  const slug = getProductSlug(product);
  const name = product.nameBn || product.name || "পণ্য";
  const price = formatPrice(product.today);
  const pct = formatPrice(product.change?.pct ?? 0);
  const dir = product.change?.dir;

  const priceColor =
    dir === "up"
      ? "text-green-600"
      : dir === "down"
        ? "text-red-600"
        : "text-[#183b2b]";

  const changeStyle =
    dir === "up"
      ? "bg-green-50 text-green-600"
      : dir === "down"
        ? "bg-red-50 text-red-600"
        : "bg-gray-100 text-gray-600";

  const card = (
    <div
      className={`h-full rounded-xl border border-[#e2e9e1] bg-white p-4 transition duration-200 ${
        slug
          ? "hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
          : "opacity-70"
      }`}
    >
      {!compact && (
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1f7e9] text-2xl">
            {product.image?.startsWith("http") ? (
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

          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
            </p>

            <h3 className="mt-1 font-bold text-[#183b2b]">
              {name}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              প্রতি {unitLabels[product.unit || ""] || product.unit || "একক"}
            </p>
          </div>
        </div>
      )}

      {compact && (
        <h3 className="font-bold text-[#183b2b]">{name}</h3>
      )}

      <div
        className={`${
          compact ? "mt-2" : "mt-4"
        } flex items-end justify-between gap-2 border-t border-gray-100 pt-3`}
      >
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className={`mt-1 text-xl font-extrabold ${priceColor}`}>
            ৳{price}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${changeStyle}`}
        >
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} {pct}%
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-green-700">
        বিস্তারিত দেখুন →
      </p>
    </div>
  );

  if (!slug) {
    return <div>{card}</div>;
  }

  return (
    <Link
      href={
        isLoggedIn
          ? `/product/${encodeURIComponent(slug)}`
          : `/signin?next=${encodeURIComponent(`/product/${slug}`)}`
      }
      className="block h-full"
      aria-label={`${name} এর বিস্তারিত দেখুন`}
    >
      {card}
    </Link>
  );
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = Boolean(session?.user);

  let products: Product[] = [];

  try {
    const data = await getProducts();

    if (Array.isArray(data)) {
      products = data;
    } else if (Array.isArray(data?.products)) {
      products = data.products;
    } else if (Array.isArray(data?.data)) {
      products = data.data;
    }
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  const increasedProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        Number(b.change?.pct ?? 0) - Number(a.change?.pct ?? 0),
    )
    .slice(0, 6);

  const decreasedProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        Number(a.change?.pct ?? 0) - Number(b.change?.pct ?? 0),
    )
    .slice(0, 6);

  return (
    <>
      <Navbar products={products} />
      <Hero />

      <main className="min-h-screen bg-[#f0f5ef] px-4 py-8 text-[#183b2b] sm:px-6">
        <div className="mx-auto max-w-6xl">
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">
              <span className="text-green-600">▲</span> আজ দাম বেড়েছে
            </h2>

            {increasedProducts.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {increasedProducts.map((product, index) => (
                  <ProductLinkCard
                    key={product.id ?? product._id ?? product.slug ?? index}
                    product={product}
                    compact
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white p-5 text-sm text-gray-500">
                দাম বৃদ্ধির তথ্য এখন পাওয়া যাচ্ছে না।
              </p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">
              <span className="text-red-600">▼</span> আজ দাম কমেছে
            </h2>

            {decreasedProducts.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {decreasedProducts.map((product, index) => (
                  <ProductLinkCard
                    key={product.id ?? product._id ?? product.slug ?? index}
                    product={product}
                    compact
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white p-5 text-sm text-gray-500">
                দাম কমার তথ্য এখন পাওয়া যাচ্ছে না।
              </p>
            )}
          </section>

          <section id="সব-পণ্য" className="scroll-mt-5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold sm:text-2xl">
                  সব পণ্য
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  প্রয়োজনীয় পণ্যের বর্তমান বাজারদর
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                মোট {formatPrice(products.length)}টি পণ্য
              </span>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
                <p className="font-semibold">
                  পণ্যের তথ্য পাওয়া যায়নি
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  API অথবা ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                  <ProductLinkCard
                    key={product.id ?? product._id ?? product.slug ?? index}
                    product={product}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
<footer className="mt-12 border-t border-gray-200 bg-white px-4 py-5">
  <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row sm:items-center">
    <p className="text-xs text-gray-800">
      বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
    </p>

    <p className="text-xs text-gray-800 sm:text-right">
      সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
    </p>
  </div>
</footer>

    </>
  );
}


