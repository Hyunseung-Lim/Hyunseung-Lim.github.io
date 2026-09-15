/**
 * Resolves a root-relative asset path (e.g. "/projects/aqua/icon.png") against PUBLIC_URL.
 * Absolute URLs and data URIs are returned untouched.
 */
export const assetUrl = (path) => {
  if (!path) return null;
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = process.env.PUBLIC_URL || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};
