// types.ts
type Variant = "white" | "grey" | "black";

type ProductId =
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

type StepId = "cameras" | "plan" | "sensors" | "accessories";

type StepIcon = "camera" | "shield" | "sensor" | "grid";

type BundleStep = {
  id: StepId;
  title: string;
  icon: StepIcon;
};


type ProductCategory = StepId;

type Badge = {
  text: string;
  color: string;
};

type ProductVariant = {
  id: string;
  label: string;
  thumbnail: string;
};

type IncludedBenefit = {
  id: string;
  title: string;
  icon: string;
  price?: number;
  compareAtPrice?: number | null;
};


type BaseProduct = {
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


type CameraProduct = BaseProduct & {
  category: "cameras";
};


type PlanProduct = BaseProduct & {
  category: "plan";
  billing: "month" | "year";
  includedBenefits: IncludedBenefit[];
};


type SensorProduct = BaseProduct & {
  category: "sensors";
  required?: boolean;
};


type AccessoryProduct = BaseProduct & {
  category: "accessories";
};


type Product =
  | CameraProduct
  | PlanProduct
  | SensorProduct
  | AccessoryProduct;


type ReviewConfig = {
  financingText: string;
  checkoutButton: string;
  saveForLaterText: string;
  savingsMessage: string;
};


type BundleConfig = {
  steps: BundleStep[];
  products: Product[];
  review: ReviewConfig;
};