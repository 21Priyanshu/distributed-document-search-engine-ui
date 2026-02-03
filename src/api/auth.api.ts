export type TokenResponse = {
  token?: string;
  [k: string]: any;
};

/**
 * Request a token from the backend for the given userId.
 * The backend endpoint used by the curl example is:
 * POST http://localhost:8080/auth/login?userId=Priyanshu
 */
export async function generateToken(
  userId?: string,
  existingToken?: string
): Promise<string> {
  const url = new URL("http://localhost:8080/auth/login");
  if (userId) url.searchParams.set("userId", userId);

  const headers: Record<string, string> = {};
  // if (existingToken) headers["Authorization"] = `Bearer ${existingToken}`;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Token generation failed");
  }

  // Try to parse JSON and extract token, otherwise return text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = (await res.json()) as TokenResponse;
    if (json.token) return json.token;
    // If backend returns the token under a different key, try common ones
    if ((json as any).accessToken) return (json as any).accessToken;
    // Fallback: stringify whole response
    return JSON.stringify(json);
  }

  return res.text();
}

export default generateToken;
