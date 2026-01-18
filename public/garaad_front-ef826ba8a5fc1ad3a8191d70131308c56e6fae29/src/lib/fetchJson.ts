// utils/fetchJson.ts
export async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    throw new Error(`Fetch error (${res.status}): ${res.statusText}`);
  }
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Expected JSON but got:", text.slice(0, 200));
    throw new Error(`Invalid JSON response from ${url}`);
  }
  return res.json();
}
