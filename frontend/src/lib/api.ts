const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMsg = Array.isArray(errorData.detail)
            ? errorData.detail.map((e: any) => e.msg || e.message).join(", ")
            : errorData.detail;
        }
      } catch {
        // use fallback error message
      }
      throw new Error(errorMsg);
    }

    return (await response.json()) as T;
  } catch (err: any) {
    // If backend direct connection failed, try Next.js rewrite proxy fallback
    if (err.message && err.message.includes("Failed to fetch") && !cleanEndpoint.startsWith("/api")) {
      const fallbackUrl = `/api${cleanEndpoint}`;
      const fallbackRes = await fetch(fallbackUrl, {
        ...options,
        headers,
      });
      if (fallbackRes.ok) {
        return (await fallbackRes.json()) as T;
      }
    }
    throw err;
  }
}

