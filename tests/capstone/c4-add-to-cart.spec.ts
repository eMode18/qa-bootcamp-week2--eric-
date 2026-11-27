import { test, expect } from "@playwright/test";
import { API, firstProductId, createCart, deleteCart } from "../helpers/cartApi";

test.describe("Carts API (capstone)", () => {
  // Id of a cart created by the current test, so afterEach can delete it
  let cartId: string | undefined;

  // Runs after every test, even when a check failed, so no cart is left behind
  test.afterEach(async ({ request }) => {
    if (cartId) {
      await deleteCart(request, cartId);
      cartId = undefined;
    }
  });

  test("C4 Add to a cart", async ({ request }) => {
    const productId = await firstProductId(request);

    // Creating a cart returns 201 (checked inside createCart)
    cartId = await createCart(request);

    // Adding a product returns 200
    const addResponse = await request.post(`${API}/carts/${cartId}`, {
      data: { product_id: productId, quantity: 2 },
    });
    expect(addResponse.status()).toBe(200);

    // The cart now contains exactly that product, with the quantity we sent
    const cartResponse = await request.get(`${API}/carts/${cartId}`);
    expect(cartResponse.status()).toBe(200);
    const cart = await cartResponse.json();
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(productId);
    expect(cart.cart_items[0].quantity).toBe(2);
  });

  // Extra check: creates no data, so there is nothing to clean up
  test("C5 Unknown cart returns 404", async ({ request }) => {
    const response = await request.get(`${API}/carts/does-not-exist-123`);

    expect(response.status()).toBe(404);
    // The message proves the 404 came from the Toolshop API, not a broken server
    expect(await response.json()).toEqual({ message: "Requested item not found" });
  });
});
