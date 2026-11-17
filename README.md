# ShopSure QA Capstone

## 1. Project overview
_TODO: one paragraph on what is tested (API with Postman, UI with Playwright) on automationexercise.com._

## 2. Tech stack and versions
- Node: _TODO_
- Playwright: _TODO_
- Postman: _TODO_
- Newman: _TODO_

## 3. Prerequisites and installation
_TODO_

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
_TODO: all tests, one browser, headed mode, opening the HTML report_

## 6. Folder structure
| Folder | Purpose |
|---|---|
| `pages/` | Page classes: locators and actions for one page each |
| `tests/` | Spec files, grouped by feature |
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
_TODO: added in Part 4_

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
