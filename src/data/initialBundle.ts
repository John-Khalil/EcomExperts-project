import { BundleState } from "../types/types";

export const bundleState: BundleState = {
  activeStep: "cameras",

  activeVariants: {
    "wyze-cam-v4": "white",
    "wyze-cam-pan-v3": "black",
    "wyze-cam-floodlight-v2": "white",
    "wyze-battery-cam-pro": "black"
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

    "cam-unlimited": 1
  }
};