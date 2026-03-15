import { useState, useEffect } from 'react';
import { useHiero } from './provider.js';

/**
 * useMirrorQuery declaratively fetches data from the Mirror Node.
 */
export function useMirrorQuery<T>(
  queryFn: (mirror: any) => Promise<T>,
  deps: any[] = []
) {
  const { mirror } = useHiero();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    queryFn(mirror)
      .then((result) => {
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [mirror, ...deps]);

  return { data, loading, error };
}
