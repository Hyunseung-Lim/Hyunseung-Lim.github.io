import React, { useEffect, useMemo, useState } from 'react';
import { useAssetPreloader } from '../../hooks/useAssetPreloader';
import { PageLoader } from './PageLoader';

const MAX_WAIT_TIME_MS = 5000;

export const PageLoadGuard = ({
  assets = [],
  message = 'Loading...',
  variant,
  fallback,
  children
}) => {
  const normalizedAssets = useMemo(() => (Array.isArray(assets) ? assets : [assets]), [assets]);
  const isReady = useAssetPreloader(normalizedAssets);
  const [isTimeoutReached, setIsTimeoutReached] = useState(false);

  useEffect(() => {
    setIsTimeoutReached(false);
    const timerId = setTimeout(() => {
      setIsTimeoutReached(true);
    }, MAX_WAIT_TIME_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, [normalizedAssets]);

  useEffect(() => {
    if (isReady) {
      setIsTimeoutReached(true);
    }
  }, [isReady]);

  const shouldRenderContent = isReady || isTimeoutReached;

  if (!shouldRenderContent) {
    if (fallback) {
      return fallback;
    }
    return <PageLoader message={message} variant={variant} />;
  }

  return <>{children}</>;
};

export const withPageLoader = (Component, assetFactory = []) => {
  const WrappedComponent = (props) => {
    const assets = typeof assetFactory === 'function' ? assetFactory(props) : assetFactory;

    return (
      <PageLoadGuard assets={assets}>
        <Component {...props} />
      </PageLoadGuard>
    );
  };

  WrappedComponent.displayName = `WithPageLoader(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};
