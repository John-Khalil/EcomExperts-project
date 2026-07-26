import { Minus, Plus } from "lucide-react";

import { useBundle } from "../context/BundleContext";
import useProducts from "../hooks/LoadProducts";

import type {
  Product,
  IncludedBenefit,
} from "../types/types";

type DisplayEntry = {
  product: Product;
  quantityKey: string;
  quantity: number;
  variantLabel?: string;
  thumbnail?: string;
};

export default function OrderReview() {
  const { state, updateQuantity } = useBundle();

  const { data, loading, error } = useProducts();

  const products = data?.products ?? [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Returns one entry per *selected* variant of a product.
  // Products without variants return a single entry (if quantity > 0).
  // Products with variants return one entry PER variant that has quantity > 0,
  // so selecting two different variants of the same product shows two rows.
  function getProductEntries(product: Product): DisplayEntry[] {
    const variants = product.variants ?? [];

    if (variants.length === 0) {
      const quantity = state.quantities[product.id] ?? 0;

      if (quantity <= 0) return [];

      return [
        {
          product,
          quantityKey: product.id,
          quantity,
        },
      ];
    }

    return variants
      .map((variant) => {
        const quantityKey = `${product.id}:${variant.id}`;
        const quantity = state.quantities[quantityKey] ?? 0;

        return {
          product,
          quantityKey,
          quantity,
          variantLabel: variant.label,
          thumbnail: variant.thumbnail,
        };
      })
      .filter((entry) => entry.quantity > 0);
  }

  function increase(entry: DisplayEntry) {
    const { product, quantityKey, quantity } = entry;

    updateQuantity(
      quantityKey,
      product.category === "plan" || product.price === 0
        ? 1
        : (quantity + 1) + 1
    );
  }

  function decrease(entry: DisplayEntry) {
    const { product, quantityKey, quantity } = entry;

    if (quantity <= 0) return;

    updateQuantity(
      quantityKey,
      Math.max(product.required ? 1 : 0, quantity - 1)
    );
  }

  const allEntries = products.flatMap(getProductEntries);

  const cameras = allEntries.filter(
    (entry) => entry.product.category === "cameras"
  );

  const sensors = allEntries.filter(
    (entry) => entry.product.category === "sensors"
  );

  const accessories = allEntries.filter(
    (entry) => entry.product.category === "accessories"
  );

  const plans = allEntries.filter(
    (entry) => entry.product.category === "plan"
  );

  const selectedPlan = plans[0]?.product;

  const benefits: IncludedBenefit[] =
    selectedPlan && "includedBenefits" in selectedPlan
      ? selectedPlan.includedBenefits ?? []
      : [];

  function renderSection(
    title: string,
    entries: DisplayEntry[],
    imageBackground?: string,
  ) {
    if (entries.length === 0) return null;

    return (
      <div className="mb-0.5">
        <h3 className="mb-4 text-sm uppercase text-gray-500">
          {title}
        </h3>

        <div className="space-y-5">
          {entries.map((entry) => {
            const { product, quantity, variantLabel, thumbnail } = entry;

            return (
              <div
                key={entry.quantityKey}
                className="flex items-center gap-4"
              >
                <img
                  src={thumbnail ?? product.icon ?? product.image}
                  alt={variantLabel ? `${product.name} - ${variantLabel}` : product.name}
                  className={`h-15 sm:h-20 max-w-60 rounded-lg  object-contain ${imageBackground??"bg-white"}`}
                />

                <div className="flex-1">
                  <p className="text-sm sm:text-xl font-medium">
                    {product.name}
                    {variantLabel && (
                      <span className="text-gray-500">
                        {" "}
                        <br/>
                        {variantLabel}
                      </span>
                    )}

                    {"required" in product &&
                      product.required &&
                      " (Required)"}
                  </p>
                </div>


                <div className="flex text-right items-center gap-1">
                  
                  {!(product.category==="plan")&&<div className="flex  items-end justify-end gap-2 p-1">
                    <button
                      onClick={() => decrease(entry)}
                      className="flex h-7 w-7 items-center justify-center rounded  p-1 bg-white"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-6 text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => increase(entry)}
                      className="flex h-7 w-7 items-center justify-center rounded  p-1 bg-white"
                    >
                      <Plus size={16} />
                    </button>
                  </div>}
                  <div className="flex flex-col items-end justify-end ">

                    {product.compareAtPrice && (
                      <div className="font-semibold text-gray-400 line-through">
                        $
                        {(
                          product.compareAtPrice *
                          quantity
                        ).toFixed(2)}
                        {product.category === "plan" &&
                        " /mo"}
                      </div>
                    )}

                    <div className="font-semibold text-[#4e2fd2]">
                      {product.price === 0
                        ? "FREE"
                        : `$${(
                          (product.price ?? 0) *
                            quantity
                          ).toFixed(2)}`}

                      {product.category === "plan" &&
                        " /mo"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="my-2 h-px w-full bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#edf4ff] p-6 pb-0">
      <h2 className="mb-2 text-4xl font-semibold">
        Your security system
      </h2>

      <p className="text-xl mb-4 text-gray-500">
        Review your personalized protection system designed to keep what matters most safe.
      </p>
      <div className="my-2 h-px w-full bg-gray-300" />

      {renderSection(
        "CAMERAS",
        cameras
      )}

      {renderSection(
        "SENSORS",
        sensors
      )}

      {renderSection(
        "ACCESSORIES",
        accessories
      )}

      {renderSection(
        "PLAN",
        plans,
        "bg-[#edf4ff]"
      )}

      {benefits.length > 0 && (
        <div className="mb-8  pt-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-0">
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="mr-3 h-16 w-16 object-cover"
                  />
                <span className="text-xl font-medium">
                  {benefit.title}
                </span>
              </div>

                
              <div className="text-right">
                {benefit.compareAtPrice && (
                  <div className="text-gray-400 line-through font-semibold">
                    $
                    {benefit.compareAtPrice.toFixed(2)}
                  </div>
                )}

                {(benefit.price!==undefined) &&<div className="font-semibold text-[#4e2fd2]">
                  {benefit.price === 0
                    ? "FREE"
                    : `$${benefit.price?.toFixed(2)}`}
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}