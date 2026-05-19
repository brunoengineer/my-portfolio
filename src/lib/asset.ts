/**
 * Prefix a public/ asset path with the deploy basePath.
 *
 * Plain <img src="/foo.jpg"> tags don't get the basePath automatically the way
 * <Link> and next/image do, so any local asset referenced as a string URL must
 * go through this helper. Reads NEXT_PUBLIC_BASE_PATH at build time; empty in
 * local dev, set to '/my-portfolio' by the deploy workflow.
 */
export const asset = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
};
