export const getSubdomain = (hostname: string, rootDomain: string) => {
  if (hostname.endsWith(".localhost")) {
    const left = hostname.replace(".localhost", "");
    if (!left || left === "www") return null;
    return left;
  }

  if (hostname === "localhost" || hostname === "192.168.1.7") {
    return null;
  }

  if (!hostname.endsWith(rootDomain)) return null;

  const left = hostname.replace(`.${rootDomain}`, "");
  if (!left || left === "www") return null;

  return left;
};