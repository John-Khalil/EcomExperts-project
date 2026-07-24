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
  const { products, loading } = useProducts();

  if (loading) {
    return <div>Loading...</div>;
  }

  function getQuantity(product: Product) {
    if (product.variants.length === 0) {
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
    if (product.variants.length === 0) {
      return product.id;
    }

    const variant =
      state.activeVariants[product.id as ProductId];

    return `${product.id}:${variant}`;
  }

  function increase(product: Product) {
    const key = getQuantityKey(product);

    updateQuantity(key, getQuantity(product) + 1);
  }

  function decrease(product: Product) {
    const quantity = getQuantity(product);

    if (quantity <= 0) return;

    const key = getQuantityKey(product);

    updateQuantity(key, quantity - 1);
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
      ? selectedPlan.includedBenefits
      : [];

  function renderSection(
    title: string,
    items: Product[]
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
                  className="h-20 w-20 rounded-lg border object-contain"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    {product.name}
                    {"required" in product &&
                      product.required &&
                      " (Required)"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrease(product)}
                    className="rounded border p-2"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-6 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => increase(product)}
                    className="rounded border p-2"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="w-24 text-right">
                  {product.compareAtPrice && (
                    <div className="text-gray-400 line-through">
                      $
                      {(
                        product.compareAtPrice *
                        quantity
                      ).toFixed(2)}
                    </div>
                  )}

                  <div className="font-semibold text-purple-700">
                    {product.price === 0
                      ? "FREE"
                      : `$${(
                          product.price * quantity
                        ).toFixed(2)}`}
                    {product.category === "plan" &&
                      " /mo"}
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
      product.price * getQuantity(product),
    0
  );

  const compareSubtotal =
    selectedProducts.reduce((sum, product) => {
      if (!product.compareAtPrice)
        return sum;

      return (
        sum +
        product.compareAtPrice *
          getQuantity(product)
      );
    }, 0);

  const savings =
    compareSubtotal - subtotal;

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-2 text-4xl font-bold">
        Your security system
      </h2>

      <p className="mb-8 text-gray-500">
        Review your personalized
        protection system.
      </p>

      {renderSection("CAMERAS", cameras)}

      {renderSection("SENSORS", sensors)}

      {renderSection(
        "ACCESSORIES",
        accessories
      )}

      {renderSection("PLAN", plans)}

      {benefits.length > 0 && (
        <div className="mb-8 border-t pt-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="mb-4 flex items-center justify-between"
            >
              <span>{benefit.title}</span>

              <div className="text-right">
                {benefit.compareAtPrice && (
                  <div className="text-gray-400 line-through">
                    $
                    {benefit.compareAtPrice.toFixed(
                      2
                    )}
                  </div>
                )}

                <div className="font-semibold text-purple-700">
                  {benefit.price === 0
                    ? "FREE"
                    : `$${benefit.price?.toFixed(
                        2
                      )}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-6">
        {compareSubtotal > 0 && (
          <div className="flex justify-between text-gray-500 line-through">
            <span>Regular Price</span>
            <span>
              ${compareSubtotal.toFixed(2)}
            </span>
          </div>
        )}

        <div className="mt-2 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {savings > 0 && (
          <p className="mt-4 text-green-600">
            You're saving $
            {savings.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}