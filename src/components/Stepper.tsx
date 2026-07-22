import { useState } from "react";
import type { BundleStep, StepId } from "../types/types";

type StepperProps = {
  steps: BundleStep[];
  activeStep: StepId;
  canContinue: boolean;
  onStepChange: (step: StepId) => void;
};

export default function Stepper({
  steps,
  activeStep,
  canContinue,
  onStepChange,
}: StepperProps) {
  return (
    <div className="w-full">
      {steps.map((function Step(step, index) {
        const isActive = activeStep === step.id;
        const nextStep =index < steps.length - 1 ? steps[index + 1] : null;
        const [selectedCount, setSelectedCount] = useState(0);
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
                <span className="text-base font-medium pb-2 mx-1">{`${selectedCount} `}selected</span>
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
              {step.id === "cameras" && <div>Camera products here</div>}
              {step.id === "plan" && <div>Plan products here</div>}
              {step.id === "sensors" && <div>Sensors here</div>}
              {step.id === "accessories" && <div>Accessories here</div>}

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
                        (canContinue || true)
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