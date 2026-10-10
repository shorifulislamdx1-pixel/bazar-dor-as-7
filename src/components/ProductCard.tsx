import Image from "next/image";
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

const formatPrice = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return "দাম নেই";
  }

  const price = Number(value);

  return Number.isFinite(price)
    ? `৳${price.toLocaleString("bn-BD", {
        maximumFractionDigits: 2,
      })}`
    : "দাম নেই";
};

export default function ProductCard({ product }: ProductCardProps) {
  const name = product.nameBn || product.name || "পণ্য";
  const slug = product.slug;

  const price = Number(product.today);

  const hasPrice =
    product.today !== undefined &&
    product.today !== null &&
    product.today !== "" &&
    Number.isFinite(price);

  const hasPreviousPrice =
    product.yesterday !== undefined &&
    product.yesterday !== null &&
    product.yesterday !== "";

  const previousPrice = Number(product.yesterday);

  const direction = hasPreviousPrice && Number.isFinite(previousPrice)
    ? price > previousPrice
      ? "up"
      : price < previousPrice
        ? "down"
        : "flat"
    : product.change?.dir;

  const isUp = direction === "up";
  const isDown = direction === "down";

  const change = Number(product.change?.pct);

  const hasChange =
    product.change?.pct !== undefined &&
    product.change?.pct !== null &&
    product.change?.pct !== "" &&
    Number.isFinite(change);

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-emerald-700"
      : "text-gray-500";

  const changeBackground = isUp
    ? "bg-red-50"
    : isDown
      ? "bg-emerald-50"
      : "bg-gray-100";

  const unit = product.unit || "একক";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 ${
        !slug ? "opacity-80" : ""
      }`}
    >
      {/* Product Header */}
      <div className="p-4 pb-3 sm:p-5 sm:pb-4">
        <div className="flex items-start gap-3">
          {/* Product Image */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100/80 transition duration-300 group-hover:bg-emerald-100 sm:h-[72px] sm:w-[72px]">
            {product.image?.startsWith("https://") ||
            product.image?.startsWith("http://") ? (
              <Image
                src={product.image}
                alt={name}
                fill
                sizes="72px"
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <span
                className="text-3xl transition duration-300 group-hover:scale-110 sm:text-4xl"
                role="img"
                aria-label={name}
              >
                {product.image || "🛒"}
              </span>
            )}
          </div>

          {/* Product Information */}
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="mb-1.5 text-[11px] font-semibold text-emerald-700 sm:text-xs">
              {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
            </p>

            <h3 className="line-clamp-2 text-base font-bold leading-6 text-gray-900 transition-colors group-hover:text-emerald-800 sm:text-lg">
              {name}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              প্রতি {unit}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">
              আজকের বাজারদর
            </p>

            <p
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                hasPrice ? "text-emerald-950" : "text-gray-400"
              }`}
            >
              {formatPrice(product.today)}
            </p>
          </div>

          {/* Price Change */}
          {hasChange && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold ${changeColor} ${changeBackground}`}
            >
              <span aria-hidden="true">
                {isUp ? "▲" : isDown ? "▼" : "—"}
              </span>

              {Math.abs(change).toLocaleString("bn-BD", {
                maximumFractionDigits: 2,
              })}
              %
            </span>
          )}
        </div>

        {/* Price Comparison */}
        {hasPreviousPrice && Number.isFinite(previousPrice) && (
          <p className="mt-3 text-xs text-gray-500">
            গতকাল:{" "}
            <span className="font-semibold text-gray-700">
              {formatPrice(product.yesterday)}
            </span>

            {price !== previousPrice && (
              <span className={isUp ? "text-red-600" : "text-emerald-700"}>
                {" "}
                · {isUp ? "দাম বেড়েছে" : "দাম কমেছে"}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-auto border-t border-gray-100 bg-gray-50/60 px-4 py-3.5 transition-colors group-hover:bg-emerald-50/60 sm:px-5">
        {slug ? (
          <Link
            href={`/product/${encodeURIComponent(slug)}`}
            aria-label={`${name} পণ্যের বিস্তারিত দেখুন`}
            className="flex items-center justify-between gap-2 text-sm font-bold text-emerald-800"
          >
            <span>বিস্তারিত দেখুন</span>

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-400">
            বিস্তারিত তথ্য পাওয়া যাচ্ছে না
          </p>
        )}
      </div>
    </article>
  );
}
