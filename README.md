# QA Bootcamp Week 2: Toolshop test suite

Playwright tests (UI and API) for the [Toolshop](https://practicesoftwaretesting.com) demo shop, written during Week 2 of the QA bootcamp.

## Prerequisites

- [Node.js](https://nodejs.org/) (the current LTS version)
- [Git](https://git-scm.com/)

## Run the suite in three steps

Run every command from the project folder (the one with `package.json`), not from `tests/`.

1. **Install** the dependencies and the Chromium browser:

   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Copy** `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `Copy-Item .env.example .env`. You don't need to change anything in it.

3. **Run** the tests:

   ```bash
   npm test
   ```

   All 10 tests should pass. To run one file, add its path, for example `npm test -- tests/api-cart.spec.ts`.

> Never commit `.env`. It is listed in `.gitignore`; keep it there.

## What's in the suite

| File | Type | What it checks |
|------|------|----------------|
| `tests/home-title.spec.ts` | UI | The home page has the expected title. |
| `tests/search-pliers.spec.ts` | UI | Searching for "pliers" shows only products with "pliers" in the name. |
| `tests/invalid-login.spec.ts` | UI | An invalid login shows "Invalid email or password". |
| `tests/sort-price.spec.ts` | UI (page object) | Sorting by "Price (Low - High)" lists products in ascending price order (case EW-11). |
| `tests/pages/ProductsPage.ts` | Page object | Locators and actions for the product list, used by `sort-price.spec.ts`. |
| `tests/api-products.spec.ts` | API | `GET /products` returns 200 and a non-empty product list. |
| `tests/api-cart.spec.ts` | API | Creates a cart, adds a product and checks the cart; an unknown cart id returns 404. Every cart a test creates is deleted afterwards, even if the test fails. |

| `tests/capstone/c3-sort-by-price.spec.ts` | UI (page object) | Capstone C3: sorting by price is cheapest first, across pages 1 and 2. |
| `tests/capstone/c4-add-to-cart.spec.ts` | API | Capstone C4: create a cart, add a product, check the cart; C5: an unknown cart returns 404. Uses `tests/helpers/cartApi.ts`. |

The capstone case choices, test-design notes and trace diagnosis are in [CAPSTONE.md](CAPSTONE.md).

`features/cart.feature` describes the Toolshop cart flow in Given/When/Then. It is documentation only and is not automated. The optional Cucumber-js scenario was not done.

## Debugging a failing test

Record a trace and open it in the trace viewer:

```bash
npx playwright test tests/home-title.spec.ts --trace on
npx playwright show-trace test-results/<test-folder>/trace.zip
```

The test output prints the exact `show-trace` command to use.

## Scripts

- `npm test`: runs all Playwright tests in `tests/`.
- `npm run check`: checks your `.env` and that you can reach the Toolshop API.
