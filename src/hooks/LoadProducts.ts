import { useEffect, useState } from "react";
import productsData from "../data/products.json";
import type { BundleConfig } from "../types/types";

type UseLoadProductsReturn = {
  data: BundleConfig | null;
  loading: boolean;
  error: string | null;
};

const API_URL = "http://localhost:3001/products";

export default function useProducts(): UseLoadProductsReturn {
  const [data, setData] = useState<BundleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Optional: simulate latency
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
          const response = await fetch(API_URL);

          if (!response.ok) {
            throw new Error(`API failed: ${response.status}`);
          }

          const apiData = await response.json();

          if (!cancelled) {
            setData(apiData as BundleConfig);
          }

          return;
        } catch (apiError) {
          console.warn(
            "Mock API unavailable, falling back to local JSON:",
            apiError
          );

          // Fallback to local JSON
          if (!cancelled) {
            setData(productsData as BundleConfig);
          }
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