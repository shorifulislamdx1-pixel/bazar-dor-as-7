import Link from "next/link";

type ProductCardProps = {
  product: {
    id?: string | number;
    slug?: string;
    nameBn?: string;
    name?: string;
    image?: string;
    unit?: string;
    today?: number | string;
    yesterday?: number | string;
    change?: {
      dir?: string;
      pct?: number | string;
    };
    categoryNameBn?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const slug = product.slug;
  const name = product.nameBn || product.name || "পণ্য";
  const price = Number(product.today);

  const hasPreviousPrice =
    product.yesterday !== undefined &&
    product.yesterday !== null &&
    product.yesterday !== "";

  const previousPrice = Number(product.yesterday);

  const direction = hasPreviousPrice
    ? price > previousPrice
      ? "up"
      : price < previousPrice
        ? "down"
        : "flat"
    : product.change?.dir;

  const isUp = direction === "up";
  const isDown = direction === "down";

  const priceColor =
    direction === "up"
      ? "text-green-600"
      : direction === "down"
        ? "text-red-600"
        : "text-gray-900";

  const changeColor =
    direction === "up"
      ? "text-green-600"
      : direction === "down"
        ? "text-red-600"
        : "text-gray-500";

  const change = Number(product.change?.pct ?? 0);

  return (
    <Link
      href={slug ? `/product/${encodeURIComponent(slug)}` : "#"}
      aria-disabled={!slug}
      className={`group block rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg ${
        !slug ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50">
          {product.image?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl">{product.image || "🛒"}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-bold text-gray-900 group-hover:text-green-700">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <span className={`text-2xl font-extrabold ${priceColor}`}>
          {product.today !== undefined && Number.isFinite(price)
            ? `৳${price.toLocaleString("bn-BD")}`
            : "দাম নেই"}
        </span>

        <span className="text-sm text-gray-500">
          / {product.unit || "একক"}
        </span>
      </div>

      {product.change && (
        <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
          {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
          {change.toLocaleString("bn-BD")}%
          <span className="font-normal text-gray-500">
            {" "}গত দিনের তুলনায়
          </span>
        </p>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 text-sm font-medium text-green-700">
        বিস্তারিত দেখুন →
      </div>
    </Link>
  );
}
