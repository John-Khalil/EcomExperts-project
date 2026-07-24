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
        <span className="absolute top-3 left-4 rounded-full bg-[#5B4FE5] px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {badge.text}
        </span>
      )}

      <div className="flex max-xl:flex-col gap-4">
        
        <div className="flex h-40 w-40 mx-auto flex-none items-center justify-center overflow-hidden rounded-xl bg-white">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-2"
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <h3 className="text-2xl font-semibold text-slate-900">
            {name}
          </h3>

          {description && (
            <p className="mt-1 text-lg leading-snug text-slate-500">
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

          {(variants??[]).length > 0 && (
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
                    className={`flex items-center gap-1 rounded-md border-2 px-2.5 py-1.5 text-sm font-normal transition-colors
                    ${
                      isActive
                        ? "border-[#0aa288] bg-[#f6fefc]/5 text-[#1f1f1f]"
                        : "border-[#cccccc] text-[#1f1f1f] hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.label}
                      className="h-7 w-7 rounded-full object-cover"
                    />

                    {v.label}

                    {/* {isActive && (
                      <Check
                        size={12}
                        className="text-[#5B4FE5]"
                      />
                    )} */}
                  </button>
                );
              })}
            </div>
          )}




          <div className="mt-4 flex items-end justify-between">
            <div className="flex items-center gap-2 rounded-lg p-1">
              <button
                type="button"
                onClick={decrease}
                disabled={quantity === 0}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent border-2"
              >
                <Minus size={14} />
              </button>

              <span className="w-5 text-center text-xl font-semibold tabular-nums">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increase}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 bg-[#f0f4f7]"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right leading-tight max-xl:flex max-xl:items-end max-xl:gap-2">
              {compareAtPrice != null && (
                <div className="text-lg font-normal text-red-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </div>
              )}

              <div className="text-lg font-normal text-slate-900">
                ${price.toFixed(2)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}