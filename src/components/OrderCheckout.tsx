// components/OrderReview.tsx

import { useMemo } from "react";
import { useBundle } from "../context/BundleContext";
import useProducts from "../hooks/LoadProducts";

export default function OrderCheckout() {
  const { state } = useBundle();
  const { data, loading, error } = useProducts();

  const totals = useMemo(() => {
    if (!data) {
      return {
        subtotal: 0,
        total: 0,
        savings: 0,
      };
    }

    let subtotal = 0;
    let total = 0;

    for (const product of data.products) {
      const activeVariant = state.activeVariants[product.id as any];

      const quantity =
        (product?.variants??[]).length > 0 && activeVariant
          ? state.quantities[`${product.id}:${activeVariant}`] ?? 0
          : state.quantities[product.id] ?? 0;

      total += product.price * quantity;

      subtotal +=
        (product.compareAtPrice ?? product.price) * quantity;
    }

    return {
      subtotal,
      total,
      savings: subtotal - total,
    };
  }, [data, state]);

  if (loading) {
    return (
      <aside className="rounded-xl bg-[#eef2fb] p-6">
        Loading...
      </aside>
    );
  }

  if (error || !data) {
    return (
      <aside className="rounded-xl bg-[#eef2fb] p-6">
        Failed to load review.
      </aside>
    );
  }

  const { review } = data;

  return (
    <aside className="rounded-2xl bg-[#edf4ff] p-6 pt-0 lg:pt-6 xl:pt-0">
      {/* Header */}
      <div className="flex justify-between items-center gap-5">
        <img
          src={review.sticker}
          alt=""
          className="h-32 w-32 lg:h-38 w-38 xl:h-32 w-32 shrink-0 object-contain"
        />

        <div className="hidden lg:block xl:hidden">
          <h3 className="text-2xl font-semibold text-zinc-900">
            {review.title}
          </h3>

          <p className="mt-4 text-xl leading-relaxed text-zinc-700">
            {review.description}
          </p>
        </div>

        {/* Financing + Price */}
        <div className=" flex flex-col items-end justify-between  lg:hidden xl:flex flex-col">
          <div className="rounded bg-[#4e2fd2] px-2 py-0 mb-2 text-base font-medium text-white">
            {review.financingText}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-xl text-gray-500 line-through">
              ${totals.subtotal.toFixed(2)}
            </span>

            <span className="text-2xl font-bold text-[#4e2fd2]">
              ${totals.total.toFixed(2)}
            </span>
          </div>
        </div>

      </div>

      {/* Financing + Price */}
      <div className="mt-10 flex items-end justify-between hidden lg:flex xl:hidden">
        <div className="rounded bg-[#4e2fd2] px-3 py-1 text-lg font-medium text-white">
          {review.financingText}
        </div>

        <div className="flex items-end gap-3">
          <span className="text-2xl text-gray-500 line-through">
            ${totals.subtotal.toFixed(2)}
          </span>

          <span className="text-3xl font-bold text-[#4e2fd2]">
            ${totals.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Savings */}
      <p className="mt-6 text-center text-base font-semibold text-[#0aa288]">
        {review.savingsMessage.replace(
          /\$[\d,.]+/,
          `$${totals.savings.toFixed(2)}`
        )}
      </p>

      {/* Checkout */}
      <button className="mt-2 w-full rounded-lg bg-[#4e2fd2] py-5 text-2xl font-semibold text-white transition hover:opacity-90">
        {review.checkoutButton}
      </button>

      {/* Save Later */}
      <button className="mt-2 block w-full text-center text-lg  text-zinc-600 underline">
        {review.saveForLaterText}
      </button>
    </aside>
  );
}