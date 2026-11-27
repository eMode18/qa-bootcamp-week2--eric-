import { expect, type APIRequestContext } from "@playwright/test";

// Full API address: baseURL in playwright.config.ts points at the UI site, not the API
export const API = "https://api.practicesoftwaretesting.com";

// Product ids change when the demo data is reset, so look one up instead of hard-coding it
export async function firstProductId(request: APIRequestContext): Promise<string> {
  const response = await request.get(`${API}/products`);
  expect(response.status()).toBe(200);
  return (await response.json()).data[0].id;
}

// Creates an empty cart and returns its id
export async function createCart(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${API}/carts`);
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  expect(id).toBeTruthy();
  return id;
}

// Deletes a cart so no test data is left on the shared site
export async function deleteCart(request: APIRequestContext, cartId: string) {
  const response = await request.delete(`${API}/carts/${cartId}`);
  expect(response.status()).toBe(204);
}
