import { useState, useEffect, useCallback, useRef } from "react";
import { extractApiError } from "@/src/lib/apiClient";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for async data fetching.
 *
 * @param factory  - Function that returns a Promise. Re-runs when `deps` change.
 * @param deps     - Dependency array (same semantics as useEffect).
 *
 * @example
 * const { data, loading, error, refetch } = useAsync(
 *   () => getClinicAppointments(),
 *   [],
 * );
 */
export function useAsync<T>(
  factory: () => Promise<T>,
  deps: React.DependencyList,
): AsyncState<T> {
  // Always call the latest factory without adding it to the effect deps.
  const factoryRef = useRef(factory);
  useEffect(() => {
    factoryRef.current = factory;
  });

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await factoryRef.current();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(extractApiError(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
