import { useEffect, useMemo, useState } from 'react';

const loadedAssets = new Set();

const normalizeAsset = (asset) => {
  if (typeof asset === 'string') {
    return asset;
  }
  if (asset && typeof asset === 'object' && typeof asset.src === 'string') {
    return asset.src;
  }
  return null;
};

const createLoadPromise = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    if (loadedAssets.has(src)) {
      resolve(src);
      return;
    }

    const image = new Image();
    image.onload = () => {
      loadedAssets.add(src);
      resolve(src);
    };
    image.onerror = () => {
      // Treat errors as resolved to avoid blocking the UI forever.
      loadedAssets.add(src);
      resolve(src);
    };
    image.src = src;
  });

export const useAssetPreloader = (assets = []) => {
  const [isReady, setIsReady] = useState(false);

  const normalizedAssets = useMemo(
    () =>
      Array.from(
        new Set(
          (Array.isArray(assets) ? assets : [assets])
            .map(normalizeAsset)
            .filter(Boolean)
        )
      ),
    [assets]
  );

  useEffect(() => {
    let isMounted = true;
    if (normalizedAssets.length === 0) {
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    setIsReady(false);
    Promise.all(normalizedAssets.map(createLoadPromise)).then(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [normalizedAssets]);

  return isReady;
};
