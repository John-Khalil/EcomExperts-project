import { useEffect, useState } from "react";
import productsData from "../data/products.json";
import type { BundleConfig } from "../types/types";

type UseLoadProductsReturn = {
  data: BundleConfig | null;
  loading: boolean;
  error: string | null;
};

export default function useProducts(): UseLoadProductsReturn {
  const [data, setData] = useState<BundleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        setLoading(true);

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!cancelled) {
          setData(productsData as BundleConfig);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}