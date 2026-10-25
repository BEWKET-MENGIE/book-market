
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Book request failed: ${response.status}`);
  }

  return response.json();
}

export async function getBooks() {
  return request("/books");
}

export async function getBookById(id) {
  if (!id) {
    throw new Error("A book ID is required.");
  }

  return request(`/books/${encodeURIComponent(id)}`);
}

export async function searchBooks(query) {
  const params = new URLSearchParams({ q: query });
  return request(`/books?${params.toString()}`);
}

export async function getBooksByCategory(category) {
  const params = new URLSearchParams({ category });
  return request(`/books?${params.toString()}`);
}
