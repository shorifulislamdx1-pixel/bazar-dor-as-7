import Link from "next/link";
import { getProductsByCategory, getProducts } from "@/lib/api";
import Navbar from "@/components/Navbar";
import SortDropdown from "@/components/SortDropdown";
import { notFound } from "next/navigation";

export const instant = false;

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let products: Product[] = [];
  let allProducts: Product[] = [];

  try {
    const data = await getProductsByCategory(slug);
    products = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load category products:", error);
  }

  try {
    const data = await getProducts();
    allProducts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  // API থেকে ক্যাটাগরির পণ্য না এলে invalid category দেখানো হবে।
  if (
    products.length === 0 &&
    !allProducts.some((product) => product.categoryNameBn === slug)
  ) {
    notFound();
  }

  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  const categoryName = products[0]?.categoryNameBn || slug;

  return (
    <>
      <Navbar products={allProducts} />

      <main className="min-h-screen bg-[#f0f5ef] px-4 py-8 text-[#183b2b] sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                {categoryName}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                এই ক্যাটাগরির বর্তমান বাজারদর
              </p>
              <p className="mt-1 text-xs text-gray-500">
                মোট {formatPrice(sortedProducts.length)}টি পণ্য
              </p>
            </div>

            <SortDropdown slug={slug} sort={sort} />
          </div>

          {sortedProducts.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
              <div className="text-4xl">🛒</div>
              <h2 className="mt-3 font-bold">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                পরে আবার চেষ্টা করো অথবা সব পণ্য দেখো।
              </p>
              <Link
                href="/#সব-পণ্য"
                className="mt-5 inline-block rounded-xl bg-[#183b2b] px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
              >
                সব পণ্য দেখুন
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <Link
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="block rounded-xl border border-[#e2e9e1] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1f7e9] text-2xl">
                      {product.image?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.nameBn}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        product.image || "🛒"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-bold">{product.nameBn}</h2>
                      <p className="mt-1 text-xs text-gray-500">
                        প্রতি {unitLabels[product.unit] || product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">আজকের দাম</p>
                    <p className="mt-1 text-xl font-extrabold">
                      ৳{formatPrice(product.today)}
                    </p>

                    <p
                      className={`mt-2 text-xs font-semibold ${
                        product.change?.dir === "up"
                          ? "text-red-600"
                          : product.change?.dir === "down"
                            ? "text-green-700"
                            : "text-gray-500"
                      }`}
                    >
                      {product.change?.dir === "up"
                        ? "▲ দাম বেড়েছে"
                        : product.change?.dir === "down"
                          ? "▼ দাম কমেছে"
                          : "— দাম অপরিবর্তিত"}{" "}
                      ({formatPrice(product.change?.pct ?? 0)}%)
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
