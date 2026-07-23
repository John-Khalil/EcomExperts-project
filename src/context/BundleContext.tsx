import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

import type { BundleState, ProductId, Variant, StepId } from "../types/types";

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
  },
};


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

  switch(action.type){

    case "SET_STEP":
      return {
        ...state,
        activeStep: action.payload,
      };


    case "SET_VARIANT":
      return {
        ...state,
        activeVariants:{
          ...state.activeVariants,
          [action.payload.productId]:
            action.payload.variant,
        },
      };


    case "UPDATE_QUANTITY":
      return {
        ...state,
        quantities:{
          ...state.quantities,
          [action.payload.id]:
            action.payload.quantity,
        },
      };


    default:
      return state;
  }
}


type BundleContextType = {
  state: BundleState;

  setStep:(step:StepId)=>void;

  setVariant:(
    productId:ProductId,
    variant:Variant
  )=>void;

  updateQuantity:(
    id:string,
    quantity:number
  )=>void;
};



const BundleContext = createContext<
  BundleContextType | undefined
>(undefined);



export function BundleProvider({
  children,
}:{
  children:ReactNode;
}){

  const [state,dispatch] =
    useReducer(bundleReducer,initialState);



  function setStep(step:StepId){
    dispatch({
      type:"SET_STEP",
      payload:step,
    });
  }


  function setVariant(
    productId:ProductId,
    variant:Variant
  ){
    dispatch({
      type:"SET_VARIANT",
      payload:{
        productId,
        variant,
      },
    });
  }


  function updateQuantity(
    id:string,
    quantity:number
  ){
    dispatch({
      type:"UPDATE_QUANTITY",
      payload:{
        id,
        quantity,
      },
    });
  }



  return (
    <BundleContext.Provider
      value={{
        state,
        setStep,
        setVariant,
        updateQuantity,
      }}
    >
      {children}
    </BundleContext.Provider>
  );
}



export function useBundle(){

  const context =
    useContext(BundleContext);


  if(!context){
    throw new Error(
      "useBundle must be used inside BundleProvider"
    );
  }


  return context;
}