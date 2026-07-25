import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

import type { BundleState, ProductId, Variant, StepId } from "../types/types";

const STORAGE_KEY = "bundle-state";

const initialState: BundleState = {
  activeStep: "cameras",

  activeVariants: {
    "wyze-cam-v4": "white",
    "wyze-cam-pan-v3": "black",
    "wyze-cam-floodlight-v2": "white",
    "wyze-battery-cam-pro": "black",
  },

  quantities: {
    "wyze-cam-v4:white": 1,
    "wyze-cam-v4:grey": 0,
    "wyze-cam-v4:black": 0,

    "wyze-cam-pan-v3:white": 0,
    "wyze-cam-pan-v3:black": 2,

    "wyze-cam-floodlight-v2:white": 0,
    "wyze-cam-floodlight-v2:black": 0,

    "wyze-duo-doorbell": 0,

    "wyze-battery-cam-pro:white": 0,
    "wyze-battery-cam-pro:black": 0,

    "motion-sensor": 2,
    "sense-hub": 1,
    "microsd-256": 2,

    "cam-unlimited": 1,
    "wyze-30-days-refund-protection": 1,
  },
};

// Reads whatever was saved last time, falling back to the hardcoded default.
function loadInitialState(): BundleState {
  if (typeof window === "undefined") return initialState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw) as Partial<BundleState>;

    // Basic shape check so a corrupted/old-shape value doesn't crash the app.
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.activeVariants ||
      !parsed.quantities
    ) {
      return initialState;
    }

    return {
      ...initialState,
      ...parsed,
      activeVariants: {
        ...initialState.activeVariants,
        ...parsed.activeVariants,
      },
      quantities: {
        ...initialState.quantities,
        ...parsed.quantities,
      },
    };
  } catch {
    return initialState;
  }
}

type BundleAction =
  | {
      type: "SET_STEP";
      payload: StepId;
    }
  | {
      type: "SET_VARIANT";
      payload: {
        productId: ProductId;
        variant: Variant;
      };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: string;
        quantity: number;
      };
    };

function bundleReducer(
  state: BundleState,
  action: BundleAction
): BundleState {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        activeStep: action.payload,
      };

    case "SET_VARIANT":
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.payload.productId]: action.payload.variant,
        },
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.payload.id]: action.payload.quantity,
        },
      };

    default:
      return state;
  }
}

type BundleContextType = {
  state: BundleState;

  setStep: (step: StepId) => void;

  setVariant: (productId: ProductId, variant: Variant) => void;

  updateQuantity: (id: string, quantity: number) => void;

  save: () => void;
};

const BundleContext = createContext<BundleContextType | undefined>(
  undefined
);

export function BundleProvider({ children }: { children: ReactNode }) {
  // Lazy initializer runs once, synchronously, before first paint —
  // no flash of default state before the saved state loads.
  const [state, dispatch] = useReducer(bundleReducer, undefined, loadInitialState);

  function setStep(step: StepId) {
    dispatch({
      type: "SET_STEP",
      payload: step,
    });
  }

  function setVariant(productId: ProductId, variant: Variant) {
    dispatch({
      type: "SET_VARIANT",
      payload: {
        productId,
        variant,
      },
    });
  }

  function updateQuantity(id: string, quantity: number) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        id,
        quantity,
      },
    });
  }

  // Call this when the user presses "save" — writes current state to localStorage.
  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save bundle state:", err);
    }
  }

  return (
    <BundleContext.Provider
      value={{
        state,
        setStep,
        setVariant,
        updateQuantity,
        save,
      }}
    >
      {children}
    </BundleContext.Provider>
  );
}

export function useBundle() {
  const context = useContext(BundleContext);

  if (!context) {
    throw new Error("useBundle must be used inside BundleProvider");
  }

  return context;
}