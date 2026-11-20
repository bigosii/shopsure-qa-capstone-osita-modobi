# ShopSure QA Capstone

## 1. Project overview
This repository checks whether the ShopSure store ([automationexercise.com](https://automationexercise.com)) is ready for release. The **API** is tested with a Postman collection (run in the Postman app or from the command line with Newman) covering all 8 endpoints, with positive and negative tests and a chained account lifecycle. The **user interface** is tested with Playwright on Chromium and Firefox, using the Page Object Model, across 9 user journeys: register, log in, wrong password, existing-email signup, log out, search, product details, cart totals and removing a product. Two JavaScript utility modules (a test data generator and a cart price calculator) support the UI tests. Anything that looks wrong on the site is recorded in the Findings section.

## 2. Tech stack and versions
| Tool | Version | Used for |
|---|---|---|
| Node.js | 26.10.0 (npm 11.19.1) | Running Playwright, Newman and the utility checks |
| Playwright (`@playwright/test`) | 1.65.1 | UI tests on Chromium and Firefox |
| Postman | 12.36.4 (collection format v2.1) | Building and running the API collection |
| Newman | 6.2.3, with `newman-reporter-htmlextra` 1.23.1 | Running the collection from the command line and creating the HTML report |

The project uses JavaScript ES modules (`"type": "module"` in `package.json`).

## 3. Prerequisites and installation
You need:
- [Node.js](https://nodejs.org) 20 or newer (tested on 26.10.0), which includes npm
- [Git](https://git-scm.com)
- The [Postman app](https://www.postman.com/downloads/) (only for running the collection in Postman; Newman needs no app)

Clone the repository and install everything:

```bash
git clone https://github.com/bigosii/shopsure-qa-capstone-osita-modobi.git
cd shopsure-qa-capstone-osita-modobi
npm install
npx playwright install chromium firefox
```

`npm install` installs Playwright, Newman and the HTML reporter from `package.json`. `npx playwright install` downloads the two browsers the tests run on.

**Test account:** the login, logout and existing-email tests use the throwaway account in `test-data/registeredUser.json`. If that account is ever deleted, create it again with the same name, email and password (for example with the Postman **Create Account** request, or on the website's Signup page).

## 4. How to run the Postman collection
### Option A: in the Postman app
1. In Postman, click **Import** and select both files from `postman/`:
   - `ShopSure-API.postman_collection.json`
   - `shopsure.postman_environment.json`
2. In the top-right environment dropdown, select **Shopsure**.
3. Right-click the **ShopSure API** collection → **Run collection** → set **Iterations** to `3` → **Start run**.

Each run creates its own account with a unique email and deletes it at the end, so it can run any number of times in a row.

### Option B: from the command line with Newman
Install the dependencies once:

```bash
npm install
```

Then run the collection and generate the HTML report:

```bash
npm run test:api
```

This runs the following command:

```bash
npx newman run postman/ShopSure-API.postman_collection.json \
  -e postman/shopsure.postman_environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export reports/newman/shopsure-api-report.html
```

Results are printed in the terminal, and the HTML report is saved to `reports/newman/shopsure-api-report.html` (open it in any browser).

## 5. How to run Playwright tests
| What | Command |
|---|---|
| All tests on Chromium and Firefox | `npm test` |
| Chromium only | `npm run test:chromium` |
| Firefox only | `npm run test:firefox` |
| Headed mode (watch the browser) | `npm run test:headed` |
| One spec file | `npx playwright test tests/cart.spec.js` |
| Open the HTML report of the last run | `npm run report` |
| Utility module checks (Part 3) | `npm run test:utils` |

The HTML report is saved in `playwright-report/` and opens in your browser. For a failed test it shows the error, a screenshot and the page snapshot.

`baseURL` and the `data-qa` test id attribute are set in `playwright.config.js`. Every spec imports `test` from `fixtures/baseTest.js`, which blocks ad domains with `page.route` so full-screen ads cannot cover the page. This is not an API call: it only stops adverts from loading.

## 6. Folder structure
| Folder | Purpose |
|---|---|
| `pages/` | Page classes: locators and actions for one page each |
| `fixtures/` | Shared Playwright `test` that blocks ad domains before every test |
| `tests/` | Spec files, grouped by feature; `tests/utils/` holds the utility checks |
| `test-data/` | Static JSON data used by tests |
| `utils/` | JavaScript utility modules |
| `postman/` | Exported collection, environment and API review |
| `reports/` | Runner screenshot and Newman HTML report |

## 7. Test coverage summary
### API tests (Postman)
**20 requests, 92 assertions**, covering all 8 endpoints with at least one positive and one negative test each. The full collection passes 3 runs in a row (276 assertions, 0 failures).

| Endpoint | Method | Positive tests | Negative tests |
|---|---|---|---|
| `/api/productsList` | GET | Product list returned, not empty, schema check (id, name, price, brand, category) | POST is rejected (405) |
| `/api/brandsList` | GET | Brand list returned, not empty, schema check (id, brand) | PUT is rejected (405) |
| `/api/searchProduct` | POST | Search "top" returns matching products, schema check | Missing `search_product` (400); a term with no match returns an empty list |
| `/api/createAccount` | POST | Account created with a unique email | Duplicate email (400); missing `name` (400) |
| `/api/verifyLogin` | POST | Login with the created account | Missing email (400); login after deletion fails (404) |
| `/api/getUserDetailByEmail` | GET | Details match the created account, schema check; name and city match after update | Unknown email (404, no user data returned) |
| `/api/updateAccount` | PUT | Name and city updated | Wrong password (rejected with 404) |
| `/api/deleteAccount` | DELETE | Account deleted | Wrong password (rejected with 404) |

Every request asserts the HTTP status, the body's `responseCode`, the message or key data, and the `Content-Type` header.

**Chained Account Lifecycle flow:** create (unique email) → login → get details → update → get details again (confirms the change) → delete → login fails (confirms the deletion). Values pass between steps through environment variables.

### UI tests (Playwright)
**9 flows, 9 tests, run on Chromium and Firefox (18 test runs).** Flows 3, 4 and 9 are the negative tests. Tests contain only page-object calls: every locator and `expect` lives in `pages/`.

| # | Flow | Spec file | Page objects | What is verified |
|---|---|---|---|---|
| 1 | Register a new user | `signup.spec.js` | LoginPage, AccountInformationPage, AccountStatusPage, HeaderComponent | "Account Created!" text and "Logged in as" the new name. The user comes from `TestDataGenerator.generateUserProfile()`; the account is deleted through the UI in `afterEach` (skipped if it was never created) |
| 2 | Log in with valid details | `auth.spec.js` | LoginPage, HeaderComponent | "Logged in as" shows the registered user's name |
| 3 | Log in with a wrong password (negative) | `auth.spec.js` | LoginPage | Error message is visible and the user stays on `/login` |
| 4 | Sign up with an existing email (negative) | `signup.spec.js` | LoginPage | Exact error text "Email Address already exist!" from `test-data/` |
| 5 | Log out | `auth.spec.js` | LoginPage, HeaderComponent | "Logged in as" is no longer visible, "Signup / Login" is back, and the URL is `/login` |
| 6 | Search for a product | `products.spec.js` | ProductsPage | "Searched Products" heading, at least one result, and every result name contains the search term from `test-data/` |
| 7 | Product details | `products.spec.js` | ProductsPage, ProductDetailPage | Name, category, price, availability, condition and brand match `test-data/products.json` |
| 8 | Cart totals | `cart.spec.js` | ProductsPage, ProductDetailPage, CartPage | Two products from `test-data/` (one with quantity 3): each line total equals `calculateLineTotal()`, and the sum of the line totals equals `calculateCartTotal()` |
| 9 | Remove a product (negative) | `cart.spec.js` | CartPage | The removed product's row is gone and one row is left |

Both utility modules are used: `TestDataGenerator` in flow 1, and `cartPriceCalculator` (`parsePriceText`, `calculateLineTotal`, `calculateCartTotal`) in flow 8.

## 8. Findings
| # | Severity | Area | Finding |
|---|---|---|---|
| 1 | High | `GET /api/getUserDetailByEmail` | Returns a user's full personal details (name, date of birth, company, full address) to anyone who knows the email. No password or token is required. |
| 2 | Medium | `POST /api/createAccount` | Accepts an invalid email format (an account exists with the email `notanemail`, which has no `@`). |
| 3 | Medium | `POST /api/createAccount` | Accepts a country (`Nigeria`) that is not offered in the website's signup Country dropdown, so country is not validated (confirmed manually against the dropdown). |
| 4 | Medium | `POST /api/createAccount` | Required fields accept empty values: an account is created when `name`, `firstname`, `address1`, `city` and the other required fields are sent blank. Only a completely missing field is rejected. |
| 5 | Medium | All endpoints | Error responses return HTTP `200`; the real code (400/404/405) is only in the body's `responseCode`. |
| 6 | Low | All endpoints | `Content-Type` is `text/html; charset=utf-8` although the body is JSON. |
| 7 | Low | `GET /api/brandsList` | Returns 34 entries but only 8 distinct brands (one entry per product, with duplicates such as "Polo" ×6). |
| 8 | Low | `POST /api/verifyLogin` | The same message is returned whether the email or the password is missing, so the error does not say which field is absent. |
| 9 | Low | `PUT /api/updateAccount`, `DELETE /api/deleteAccount` | A wrong password returns `404 "Account not found!"` even though the account exists. The correct code is 401 Unauthorized with a message about invalid credentials; the current message misleads anyone debugging. |
| 10 | Info | `POST /api/searchProduct` | An empty `search_product` value returns all products instead of a 400 error. |
| 11 | Info | `POST /api/searchProduct` | Searching "top" also returns shirts, because the search matches the category ("Tops & Shirts"), not only the product name. |
| 12 | Medium | UI, whole site | A full-screen Google ad often covers the page after a navigation (for example after clicking **View Product**), hiding the content until it is closed. The tests block ad domains with `page.route` in `fixtures/baseTest.js`; without that, flow 7 failed every time. |
| 13 | Info | UI, whole site (site-caused failures) | During test runs the site sometimes returns its own error pages instead of the store: "This website is under heavy load (queue full)" or Cloudflare "Error 520". Any test that fails on one of these pages is caused by the live site, not the test code, and passes when rerun. |
| 14 | Low | UI, Signup | After a signup is rejected because the email already exists, the URL changes to `/signup` although the page still shows the Login and Signup forms with the error. |
| 15 | Low | UI, Product details | Clicking **Add to cart** before the page has fully loaded does nothing and shows no message, so a fast user gets no feedback. |
| 16 | Info | UI, Cart | The cart page shows a total for each line but no grand total for the whole cart. |
