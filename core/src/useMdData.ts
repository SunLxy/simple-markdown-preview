import { useEffect, useState } from 'react';
import type { CodeBlockData } from '@saqu/loader-md-react-preview/lib/interface';

export type MdDataHandle = () => Promise<{ default: CodeBlockData }>;

export const useMdData = (path: MdDataHandle) => {
  const [mdData, setMdData] = useState<CodeBlockData>({
    source: '',
    components: {},
    data: {},
    headings: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const $body = document.body
    $body.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    setLoading(() => true);
    const getMd = async () => {
      try {
        const result = await path();
        if (result.default) {
          setMdData(result.default);
        }
      } catch (err) {
        console.warn(err);
      }
      setLoading(() => false);
    };
    getMd();
    // eslint-disable-next-line
  }, [path]);
  return { mdData, loading };
};
