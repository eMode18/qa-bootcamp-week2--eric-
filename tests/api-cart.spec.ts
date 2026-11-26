import { test, expect } from "@playwright/test";

// Full API address: baseURL in playwright.config.ts points at the UI site, not the API
const API = "https://api.practicesoftwaretesting.com";

test.describe("Carts API", () => {
  // Id of a cart created by the current test, so afterEach can delete it
  let cartId: string | undefined;

  // Runs after every test, even when a check failed, so no cart is left behind
  test.afterEach(async ({ request }) => {
    if (cartId) {
      const response = await request.delete(`${API}/carts/${cartId}`);
      expect(response.status()).toBe(204);
      cartId = undefined;
    }
  });

  test("create a cart and add a product", async ({ request }) => {
    // Product ids change when the demo data is reset, so look one up instead of hard-coding it
    const productsResponse = await request.get(`${API}/products`);
    expect(productsResponse.status()).toBe(200);
    const product = (await productsResponse.json()).data[0];

    // Create an empty cart
    const createResponse = await request.post(`${API}/carts`);
    expect(createResponse.status()).toBe(201);
    cartId = (await createResponse.json()).id;
    expect(cartId).toBeTruthy();

    // Add 2 of the product to the cart
    const addResponse = await request.post(`${API}/carts/${cartId}`, {
      data: { product_id: product.id, quantity: 2 },
    });
    expect(addResponse.status()).toBe(200);

    // Read the cart back and check its fields
    const cartResponse = await request.get(`${API}/carts/${cartId}`);
    expect(cartResponse.status()).toBe(200);
    const cart = await cartResponse.json();
    expect(cart.id).toBe(cartId);
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(product.id);
    expect(cart.cart_items[0].quantity).toBe(2);
  });

  test("a cart id that does not exist returns 404", async ({ request }) => {
    // Creates nothing, so there is nothing to clean up
    const response = await request.get(`${API}/carts/does-not-exist-123`);

    expect(response.status()).toBe(404);
    // Checking the message proves the 404 came from the Toolshop API, not from a broken server
    expect(await response.json()).toEqual({ message: "Requested item not found" });
  });
});
