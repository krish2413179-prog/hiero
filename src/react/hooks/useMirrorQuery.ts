import React, { useEffect, useState, useRef } from 'react';
import { useHiero } from '../provider.js';
import { MirrorClient } from '../../mirror/client.js';

/**
 * useMirrorQuery fetches data from the Hiero Mirror Node.
 * 
 * @param queryFn - Function that takes a MirrorClient and returns a Promise.
 * @param deps - Optional dependency array to re-run the query.
 */
export function useMirrorQuery<T>(
  queryFn: (client: MirrorClient) => Promise<T>,
  deps: any[] = []
) {
  const { mirror } = useHiero();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // We use a ref for the queryFn so we don't trigger the effect unnecessarily
  // if the user passes an inline arrow function.
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    queryFnRef.current(mirror)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirror, ...deps]);

  return { data, loading, error };
}
