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

## Flakiness drill

Test: [tests/drill/save-message.spec.ts](tests/drill/save-message.spec.ts), against the trainer's page [tests/drill/index.html](tests/drill/index.html), which shows "Saved" after a random 0–1 second delay.

| Version | Runs | Passed | Failed |
|---------|------|--------|--------|
| Unfixed: click Save, wait 500 ms, read the message once, plain `toBe` check | 20 | 10 | 10 |
| Fixed: `await expect(status).toHaveText("Saved")` | 20 | 20 | 0 |

Two failure messages from the unfixed run:

```
1) [chromium] › tests\drill\save-message.spec.ts:8:1 › Drill: Save shows Saved
   Error: expect(received).toBe(expected) // Object.is equality
   Expected: "Saved"
   Received: ""
```

```
2) [chromium] › tests\drill\save-message.spec.ts:8:1 › Drill: Save shows Saved
   Error: expect(received).toBe(expected) // Object.is equality
   Expected: "Saved"
   Received: ""
```

The test was flaky because it guessed the timing: it waited a fixed 500 ms and read the message once, but the page shows "Saved" after a random delay of up to 1 second, so whenever the delay was longer than 500 ms the test read the message before it existed. The evidence is in the failures: 10 of 20 runs failed, and every failure received an empty string, never the wrong text, so the page was always correct and only too slow for the guess. I replaced the wait and the one-off read with `toHaveText`, which keeps checking until the message appears (up to 5 seconds), and I know the fix worked because the same 20 runs then passed 20 out of 20, and each run finishes as soon as "Saved" shows instead of always waiting.

## Reflection

**Which two cases did you choose, and why did you leave out the other four?**
C3 Sort by price (UI) and C4 Add to a cart (API), with C5 as an extra check in the C4 file. C1 passes both gates but is narrower than C3. C2 fails gate 1 today because other people's products on the shared site keep changing its page count. C5 creates no data, so it can't be the API case on its own. C6 is lower value than the happy path and is my next case. Full reasons are in [Case choices](#case-choices).

**Which test would most likely break first in a real project, and why?**
C3. It's a UI test, so it depends on the dropdown's label, the price text format and the pagination buttons, and any redesign touches those. It also reads a shared product list, so products added by others can shift which items land on page 2. C4 talks to a stable API contract and makes its own data, so it should last longer.

**Which failure did you diagnose, and what did the trace show?**
C4, after I changed it to expect quantity 3. The trace showed the failing step (`quantity` expected 3, received 2) and every API call succeeding: `POST /carts` 201, `POST /carts/{id}` 200, `GET /carts/{id}` 200, then `DELETE` 204. The API stored exactly what the test sent, so it was a test problem. See [Failure diagnosed from the trace](#failure-diagnosed-from-the-trace).

**Where did you have to decide something the requirement didn't say?**
- C3 only says "cheapest first". I decided to also check that page 2 carries on from page 1, so a sort that only orders each page would be caught.
- C4 doesn't say which product or quantity. I look up the first product at runtime, because ids change when the demo data is reset, and add quantity 2 so the quantity check means something (the default would be 1).
- C2 says to check the last page or the page count. I decided not to automate it, because shared data moves both during the day.

## Feedback-applied log

| Feedback (who, when) | What I changed | Where it shows in the capstone |
|----------------------|----------------|--------------------------------|
| Lilian, PR #1 (Mon): explain in the README how to run the files | Rewrote the README as a 3-step setup with a table of every test file | [README.md](README.md); "Run only the capstone tests" in this file |
| _(add your "Act on feedback" notes from Tue–Thu)_ | | |
