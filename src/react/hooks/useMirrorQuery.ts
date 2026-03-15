import { useMemo } from 'react';
import { useHiero } from '../provider.js';
import { MirrorClient } from '../../mirror/client.js';
import React from 'react';

export function useMirrorQuery<T>(
  queryFn: (client: MirrorClient) => Promise<T>
) {
  const { mirror } = useHiero();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    queryFn(mirror)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
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
  }, [queryFn, mirror]);

  return { data, loading, error };
}


