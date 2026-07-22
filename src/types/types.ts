// types.ts

export type Variant = "white" | "grey" | "black";

export type ProductId =
  | "wyze-cam-v4"
  | "wyze-cam-pan-v3"
  | "wyze-cam-floodlight-v2"
  | "wyze-battery-cam-pro"
  | "wyze-duo-doorbell"
  | "motion-sensor"
  | "sense-hub"
  | "microsd-256"
  | "cam-unlimited";

export type BundleState = {
  activeStep: string;

  activeVariants: Partial<Record<ProductId, Variant>>;

  quantities: Record<string, number>;
};


export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export type StepIcon = "camera" | "shield" | "sensor" | "grid";

export type BundleStep = {
  id: StepId;
  title: string;
  icon: string;
};


export type ProductCategory = StepId;

export type Badge = {
  text: string;
  color: string;
};


export type ProductVariant = {
  id: string;
  label: string;
  thumbnail: string;
};


export type IncludedBenefit = {
  id: string;
  title: string;
  icon: string;
  price?: number;
  compareAtPrice?: number | null;
};


export type BaseProduct = {
  id: string;
  category: ProductCategory;
  name: string;
  description?: string;
  image: string;
  learnMore?: string;
  price: number;
  compareAtPrice: number | null;
  badge?: Badge;
  variants: ProductVariant[];
};


export type CameraProduct = BaseProduct & {
  category: "cameras";
};


export type PlanProduct = BaseProduct & {
  category: "plan";
  billing: "month" | "year";
  includedBenefits: IncludedBenefit[];
};


export type SensorProduct = BaseProduct & {
  category: "sensors";
  required?: boolean;
};


export type AccessoryProduct = BaseProduct & {
  category: "accessories";
};


export type Product =
  | CameraProduct
  | PlanProduct
  | SensorProduct
  | AccessoryProduct;


export type ReviewConfig = {
  financingText: string;
  checkoutButton: string;
  saveForLaterText: string;
  savingsMessage: string;
};


export type BundleConfig = {
  steps: BundleStep[];
  products: Product[];
  review: ReviewConfig;
};