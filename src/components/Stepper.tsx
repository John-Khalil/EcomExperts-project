import { useState, type JSX,useEffect } from "react";
import type { BaseProduct, BundleStep, StepId, ProductId, BundleState } from "../types/types";
import ProductGrid from "./ProductGrid";
import useProducts from "../hooks/LoadProducts";
import ProductCard from "./ProductCard";
import { useBundle } from "../context/BundleContext";

type StepperProps = {
  steps: BundleStep[];
  activeStep: StepId|string;
  onStepChange: (step: StepId) => void;
};

type ProductSectionProps = {
  stepId: StepId;
};

/**
 * Derives the key used to store/read a product's quantity in
 * BundleState.quantities. Products without variants are keyed by
 * their plain id; products with variants are keyed as `${id}:${variant}`
 * based on the currently active variant selection.
 *
 * Used by both ProductSection and the selected-count effect below —
 * keep these in sync, since a mismatch here is what causes quantities
 * to silently disagree between the two.
 */
function getQuantityKey(
  product: BaseProduct,
  activeVariants: BundleState["activeVariants"]
) {
  const variants = product.variants ?? [];
  if (variants.length === 0) return product.id;

  const variant = activeVariants[product.id as ProductId];
  return variant ? `${product.id}:${variant}` : product.id;
}

function ProductSection({ stepId }: ProductSectionProps) {
  const { data } = useProducts();
  const { state, setVariant, updateQuantity } = useBundle();

  return (
    <ProductGrid>
      {data?.products
        .filter(product => product.category === stepId)
        .map(product => {
          const key = getQuantityKey(product, state.activeVariants);

          return (
            <ProductCard
              key={product.id}
              product={product}
              variant={state.activeVariants[product.id]}
              quantity={state.quantities[key] ?? 0}
              onVariantChange={setVariant}
              onQuantityChange={(_productId, qty) =>
                updateQuantity(key, qty)
              }
            />
          );
        })}
    </ProductGrid>
  );
}

export default function Stepper({
  steps,
  activeStep,
  onStepChange,
}: StepperProps) {
  return (
    <div className="w-full">
      {steps.map((function Step(step, index) {
        const isActive = activeStep === step.id;
        const nextStep =index < steps.length - 1 ? steps[index + 1] : null;
        const [selectedCount, setSelectedCount] = useState(0);
        const [canContinue,setCanContinue] = useState(false);
        const { state } = useBundle();
        const { data } = useProducts();
        useEffect(() => {
          if (!data?.products) return;

          const selected = data.products
            .filter(product => product.category === step.id)
            .filter(product => {
              const key = getQuantityKey(product, state.activeVariants);
              return (state.quantities[key] ?? 0) > 0;
            })
            .length;

          setSelectedCount(selected);
          setCanContinue(selected > 0);

        }, [state.quantities, state.activeVariants, data?.products, step.id]);
        return (
          <div key={step.id}  className={`
            transition
            ${isActive ? "bg-[#edf3ff]" : "bg-white"}
          `}>

            {/* Step label */}
            <div className=" pt-3">
              <p className="text-sm font-medium tracking-[3px] text-gray-500 px-5">
                STEP {index + 1} OF {steps.length}
              </p>

              <div className="mt-2 h-px w-full bg-gray-300" />
            </div>

            <button
              onClick={() => onStepChange(step.id)}
              className={`
                flex
                w-full
                items-center
                justify-between
                
                border-gray-300
                px-5
                py-6
                transition
                ${isActive ? "bg-[#edf3ff]" : "bg-white"}
              `}
            >
              {/* Left Side */}
              <div className="grid flex-1 w-full grid-cols-[40px_1fr] grid-rows-[auto_auto_auto] gap-x-5 gap-y-2 text-left">

                <img
                  src={step.icon}
                  alt={step.title}
                  className="h-10 w-10 self-center"
                />

                {/* Title */}
                <h2
                  className="
                    self-center
                    text-2xl
                    font-semibold
                    text-gray-900
                  "
                >
                  {step.title}
                </h2>
              </div>

              {/* Chevron */}
              <span className="text-purple-600 inline-flex ">
                {isActive&&<span className="text-base font-medium pb-2 mx-1">{`${selectedCount} selected`}</span>}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 fill-current transition-transform duration-200 mt-1 ${
                    isActive ? "rotate-180" : ""
                  }`}
                >
                  <path d="M12 17L19 7H5L12 17Z" />
                </svg>
              </span>
            </button>

            {/* Step Content */}
           {isActive ? (
            <div className="bg-[#edf3ff] p-6">
              {step.id === "cameras" && < ProductSection stepId={step.id} />}
              {step.id === "plan" && < ProductSection stepId={step.id} />}
              {step.id === "sensors" && < ProductSection stepId={step.id} />}
              {step.id === "accessories" && < ProductSection stepId={step.id} />}

              {nextStep && (
                <div className="inline-flex items-center justify-center w-full">
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => onStepChange(nextStep.id)}
                    className={`
                      mt-8
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      border-2
                      px-8
                      py-2
                      
                      text-2xl
                      font-semibold
                      transition
                      ${
                        canContinue
                          ? "text-[#5145E5] hover:bg-[#5145E5] hover:text-white"
                          : "cursor-not-allowed border-gray-300 text-gray-300"
                      }
                    `}
                  >
                    Next: {nextStep.title}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-px w-full bg-gray-300" />
          )}



          </div>
        );
      }))}
    </div>
  );
}