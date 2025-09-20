export const getSubdomain = (hostname: string, rootDomain: string) => {
  const cleanHost = hostname.startsWith("www.") 
    ? hostname.slice(4) 
    : hostname;

  if (cleanHost.endsWith(".localhost")) {
    const left = cleanHost.replace(".localhost", "");
    return left || null;
  }

  if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
    return null;
  }

  if (cleanHost === rootDomain) {
    return null; // kalau persis sama root domain, berarti ga ada subdomain
  }

  if (!cleanHost.endsWith(rootDomain)) return null;

  const left = cleanHost.replace(`.${rootDomain}`, "");
  return left || null;
};