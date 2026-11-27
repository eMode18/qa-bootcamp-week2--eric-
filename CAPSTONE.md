# Week 2 capstone: Toolshop

## Case choices

Gate 1: can it be automated reliably (stable data, stable UI, no timing dependency)?
Gate 2: is it worth automating (how often it runs, cost of repeating it by hand, stability, maintenance)?

| Case | Decision | Reason |
|------|----------|--------|
| C1 Search by name (UI) | Left out | Passes both gates, but it checks one input and one rule; C3 covers more of the product list, including pagination. |
| C2 Filter by category (UI) | Left out | Fails gate 1 today: other people's products on the shared site (e.g. `Product-20261127-684db0` on the Hand Tools last page) change the page count and the last page during the day, so a page-count check would be flaky. |
| **C3 Sort by price (UI)** | **Automated** | Passes both gates: the sort dropdown is stable, prices are visible to users, and no data has to be created. A wrong sort order is a visible bug shoppers hit straight away. |
| **C4 Add to a cart (API)** | **Automated** | Passes both gates: fixed status codes, and the test creates its own cart and deletes it. Adding to a cart is the core purchase path and is cheap to check on every change. |
| C5 Unknown cart (API) | Added as an extra check | It creates no data, so it can't be the API case on its own; one extra request adds a useful negative check next to C4. |
| C6 Missing quantity (API) | Left out (next) | Passes both gates, but a validation rule is lower value than the happy path. It's an easy follow-up using the same cart helper. |

## Test-design notes

### C3 Sort by price

- **Expected result:** after choosing "Price (Low - High)", the prices on page 1 are cheapest first, and page 2 carries on from where page 1 ended.
- **Test data:** none created; it uses the site's product list.
- **Could pass when it should fail:** reading the list before it reloads, if the old list happened to be in order; or a sort that only orders each page on its own. The test retries until the new list is in, and checks that page 2's first price is not lower than page 1's highest.
- **Could fail when it should pass:** reading prices while the list is reloading (handled by retrying with `expect.poll`), or another user adding a product mid-test that shifts which products land on page 2.

### C4 Add to a cart

- **Expected result:** creating a cart returns 201 and an id; adding a product with quantity 2 returns 200; the cart then holds exactly that product with quantity 2.
- **Test data:** a product id looked up at the start (ids change when the demo data is reset) and a new cart, deleted afterwards.
- **Could pass when it should fail:** checking only the status codes, since a 200 doesn't prove the item was stored. The test reads the cart back and checks the exact product and quantity.
- **Could fail when it should pass:** a hard-coded product id after a data reset (avoided by looking it up), or the API being slow or down (an environment problem, as on Thursday).

## Files

- UI: [tests/capstone/c3-sort-by-price.spec.ts](tests/capstone/c3-sort-by-price.spec.ts), using the page object [tests/pages/ProductsPage.ts](tests/pages/ProductsPage.ts)
- API: [tests/capstone/c4-add-to-cart.spec.ts](tests/capstone/c4-add-to-cart.spec.ts), using the helper [tests/helpers/cartApi.ts](tests/helpers/cartApi.ts)

Run only the capstone tests:

```bash
npx playwright test tests/capstone
```

## Failure diagnosed from the trace

I changed C4 to expect quantity 3 instead of 2, ran it with `--trace on` and opened the trace.

- **Failing step:** `expect(cart.cart_items[0].quantity).toBe(3)` at `c4-add-to-cart.spec.ts:34`. Expected 3, received 2.
- **Network calls in the trace:** `GET /products` 200, `POST /carts` 201, `POST /carts/{id}` 200, `GET /carts/{id}` 200, then `DELETE /carts/{id}` 204.
- **Classification: test problem.** Every API call succeeded, and the cart held quantity 2, which is exactly what the test sent. The API behaved correctly, and only the expected value in the test was wrong. The `DELETE` after the failure also shows the cleanup runs even when a check fails.

After restoring the expected value, the test passes again.
