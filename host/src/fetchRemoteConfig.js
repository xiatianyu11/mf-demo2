// fetchRemoteConfig.js
// Replace with your real API in production
export async function fetchRemoteConfig() {
  // Example: /mf-config.json served by host server or config service
  const res = await fetch("/mf-config.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch remote config");
  return res.json();
}
