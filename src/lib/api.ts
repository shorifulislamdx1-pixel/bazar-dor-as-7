const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

async function fetchAPI(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getProducts() {
  return fetchAPI("/products");
}

export async function getCategories() {
  return fetchAPI("/categories");
}

export async function getProductsByCategory(slug: string) {
  return fetchAPI(`/products?category=${encodeURIComponent(slug)}`);
}
