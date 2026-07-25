import { Minus, Plus } from "lucide-react";

import { useBundle } from "../context/BundleContext";
import useProducts from "../hooks/LoadProducts";

import type {
  Product,
  ProductId,
  IncludedBenefit,
} from "../types/types";

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

  function getQuantity(product: Product) {
    const variants = product.variants ?? [];

    if (variants.length === 0) {
      return state.quantities[product.id] ?? 0;
    }

    const variant =
      state.activeVariants[product.id as ProductId];

    if (!variant) return 0;

    return (
      state.quantities[
        `${product.id}:${variant}`
      ] ?? 0
    );
  }

  function getQuantityKey(product: Product) {
    const variants = product.variants ?? [];

    if (variants.length === 0) {
      return product.id;
    }

    const variant =
      state.activeVariants[product.id as ProductId];

    if (!variant) {
      return product.id;
    }

    return `${product.id}:${variant}`;
  }

  function increase(product: Product) {
    const key = getQuantityKey(product);

    updateQuantity(
      key,
      getQuantity(product) + 1
    );
  }

  function decrease(product: Product) {
    const quantity = getQuantity(product);

    if (quantity <= 0) return;

    const key = getQuantityKey(product);

    updateQuantity(
      key,
      quantity - 1
    );
  }

  const selectedProducts = products.filter(
    (product) => getQuantity(product) > 0
  );

  const cameras = selectedProducts.filter(
    (p) => p.category === "cameras"
  );

  const sensors = selectedProducts.filter(
    (p) => p.category === "sensors"
  );

  const accessories = selectedProducts.filter(
    (p) => p.category === "accessories"
  );

  const plans = selectedProducts.filter(
    (p) => p.category === "plan"
  );

  const selectedPlan = plans[0];

  const benefits: IncludedBenefit[] =
    selectedPlan &&
    "includedBenefits" in selectedPlan
      ? selectedPlan.includedBenefits ?? []
      : [];

  function renderSection(
    title: string,
    items: Product[],
    imageBackground?: string,
  ) {
    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="mb-4 text-sm uppercase text-gray-500">
          {title}
        </h3>

        <div className="space-y-5">
          {items.map((product) => {
            const quantity = getQuantity(product);

            return (
              <div
                key={product.id}
                className="flex items-center gap-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`h-20 max-w-60 rounded-lg  object-contain ${imageBackground??"bg-white"}`}
                />

                <div className="flex-1">
                  <p className="text-xl font-medium">
                    {product.name}

                    {"required" in product &&
                      product.required &&
                      " (Required)"}
                  </p>
                </div>


                <div className="flex text-right items-center gap-1">
                  
                  {!(product.category==="plan")&&<div className="flex  items-end justify-end gap-2 p-1">
                    <button
                      onClick={() => decrease(product)}
                      className="flex h-7 w-7 items-center justify-center rounded  p-1 bg-white"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-6 text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => increase(product)}
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

                    <div className="font-semibold text-purple-700">
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
      </div>
    );
  }

  const subtotal = selectedProducts.reduce(
    (sum, product) =>
      sum +
      (product.price ?? 0) *
        getQuantity(product),
    0
  );

  const compareSubtotal =
    selectedProducts.reduce(
      (sum, product) => {
        if (!product.compareAtPrice) {
          return sum;
        }

        return (
          sum +
          product.compareAtPrice *
            getQuantity(product)
        );
      },
      0
    );

  const savings =
    compareSubtotal - subtotal;

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
      <div className="my-2 h-px w-full bg-gray-300" />

      {renderSection(
        "SENSORS",
        sensors
      )}
      <div className="my-2 h-px w-full bg-gray-300" />

      {renderSection(
        "ACCESSORIES",
        accessories
      )}
      <div className="my-2 h-px w-full bg-gray-300" />

      {renderSection(
        "PLAN",
        plans,
        "bg-[#edf4ff]"
      )}
      <div className="my-2 h-px w-full bg-gray-300" />

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

                {(benefit.price!==undefined) &&<div className="font-semibold text-purple-700">
                  {benefit.price === 0
                    ? "FREE"
                    : `$${benefit.price?.toFixed(2)}`}
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <div className="pt-6">
        {compareSubtotal > 0 && (
          <div className="flex justify-between text-gray-500 line-through">
            <span>
              Regular Price
            </span>

            <span>
              ${compareSubtotal.toFixed(2)}
            </span>
          </div>
        )}

        <div className="mt-2 flex justify-between text-xl font-bold">
          <span>
            Total
          </span>

          <span>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {savings > 0 && (
          <p className="mt-4 text-green-600">
            You're saving $
            {savings.toFixed(2)}
          </p>
        )}
      </div> */}
    </div>
  );
}