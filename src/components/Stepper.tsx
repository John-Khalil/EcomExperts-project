import type { BundleStep, StepId } from "../types/types";

type StepperProps = {
  steps: BundleStep[];
  activeStep: StepId;
  onStepChange: (step: StepId) => void;
};

export default function Stepper({
  steps,
  activeStep,
  onStepChange,
}: StepperProps) {
  return (
    <div className="w-full">

      {steps.map((step, index) => {
        const isActive = activeStep === step.id;

        return (
          <div key={step.id}>

            {/* Step Header */}
            <button
              onClick={() => onStepChange(step.id)}
              className={`
                flex
                w-full
                items-center
                justify-between
                border-b
                border-gray-300
                px-5
                py-6
                transition

                ${isActive 
                  ? "bg-[#edf3ff]" 
                  : "bg-white"
                }
              `}
            >

              <div className="flex items-center gap-5">

                <img
                  src={step.icon}
                  alt={step.title}
                  className="h-10 w-10"
                />


                <div className="text-left">

                  <p className="
                    text-xs
                    tracking-[3px]
                    text-gray-500
                  ">
                    STEP {index + 1} OF {steps.length}
                  </p>


                  <h2 className="
                    mt-2
                    text-2xl
                    font-semibold
                    text-gray-900
                  ">
                    {step.title}
                  </h2>

                </div>

              </div>


              <span className="
                text-2xl
                text-purple-600
              ">
                {isActive ? "⌃" : "⌄"}
              </span>

            </button>


            {/* Step Content */}
            {isActive && (
              <div className="
                bg-[#edf3ff]
                p-6
              ">
                {step.id === "cameras" && (
                  <div>
                    Camera products here
                  </div>
                )}

                {step.id === "plan" && (
                  <div>
                    Plan products here
                  </div>
                )}

                {step.id === "sensors" && (
                  <div>
                    Sensors here
                  </div>
                )}

                {step.id === "accessories" && (
                  <div>
                    Accessories here
                  </div>
                )}
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}