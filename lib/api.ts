const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  return response;
}
