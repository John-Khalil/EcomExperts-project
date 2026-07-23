import { Minus, Plus, Check } from "lucide-react";

import type {
  Product,
  ProductId,
  ProductVariant,
  Variant,
} from "../types/types";

type ProductCardProps = {
  product: Product;

  /** Currently selected variant id (undefined if the product has no variants). */
  variant?: ProductVariant["id"];

  /** Current quantity. 0 means the product isn't in the bundle. */
  quantity: number;

  onVariantChange?: (
    productId: ProductId,
    variantId: ProductVariant["id"] | Variant
  ) => void;

  onQuantityChange: (
    productId: ProductId,
    quantity: number
  ) => void;
};

export default function ProductCard({
  product,
  variant,
  quantity,
  onVariantChange,
  onQuantityChange,
}: ProductCardProps) {
  const {
    id,
    name,
    description,
    image,
    learnMore,
    price,
    compareAtPrice,
    badge,
    variants,
  } = product;

  const selected = quantity > 0;

  const decrease = () =>
    onQuantityChange(id as ProductId, Math.max(0, quantity - 1));

  const increase = () =>
    onQuantityChange(id as ProductId, quantity + 1);

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-white p-5 transition-shadow
      ${
        selected
          ? "ring-2 ring-[#5B4FE5] shadow-[0_2px_16px_rgba(91,79,229,0.12)]"
          : "ring-1 ring-slate-200"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[#5B4FE5] px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {badge.text}
        </span>
      )}

      <div className="flex gap-4">
        <div className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-50">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-2"
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <h3 className="text-[15px] font-semibold text-slate-900">
            {name}
          </h3>

          {description && (
            <p className="mt-1 text-sm leading-snug text-slate-500">
              {description}{" "}
              {learnMore && (
                <a
                  href={learnMore}
                  className="font-medium text-[#5B4FE5] underline underline-offset-2"
                >
                  Learn More
                </a>
              )}
            </p>
          )}

          {variants.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {variants.map((v) => {
                const isActive = variant === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      onVariantChange?.(id as ProductId, v.id)
                    }
                    aria-pressed={isActive}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors
                    ${
                      isActive
                        ? "border-[#5B4FE5] bg-[#5B4FE5]/5 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.label}
                      className="h-3.5 w-3.5 rounded-full object-cover"
                    />

                    {v.label}

                    {isActive && (
                      <Check
                        size={12}
                        className="text-[#5B4FE5]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-1">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Minus size={14} />
          </button>

          <span className="w-5 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="text-right leading-tight">
          {compareAtPrice != null && (
            <div className="text-sm text-red-500 line-through">
              ${compareAtPrice.toFixed(2)}
            </div>
          )}

          <div className="text-base font-bold text-slate-900">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}