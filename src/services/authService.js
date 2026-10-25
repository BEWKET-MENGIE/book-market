
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

async function request(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Authentication failed: ${response.status}`
    );
  }

  return result;
}

export async function loginUser(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required.");
  }

  return request("/auth/login", credentials);
}

export async function registerUser(details) {
  if (!details?.name || !details?.email || !details?.password) {
    throw new Error("Name, email, and password are required.");
  }

  return request("/auth/register", details);
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }

  return true;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to retrieve user: ${response.status}`);
  }

  return response.json();
}
