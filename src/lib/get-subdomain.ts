export const getSubdomain = (hostname: string, rootDomain: string) => {
  if (!hostname.endsWith(rootDomain)) return null;

  const left = hostname.slice(0, -(`.${rootDomain}`).length);

  if (!left) return null;
  
  return left;
}