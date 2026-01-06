import React, { useMemo } from 'react';
import { useAssetPreloader } from '../../hooks/useAssetPreloader';
import { PageLoader } from './PageLoader';

export const PageLoadGuard = ({
  assets = [],
  message = 'Loading...',
  variant,
  fallback,
  children
}) => {
  const normalizedAssets = useMemo(() => (Array.isArray(assets) ? assets : [assets]), [assets]);
  const isReady = useAssetPreloader(normalizedAssets);

  if (!isReady) {
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
