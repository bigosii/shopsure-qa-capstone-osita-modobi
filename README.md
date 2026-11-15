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
_TODO: Postman app steps and Newman command_

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
_TODO: API endpoints and UI flows covered_

## 8. Findings
| # | Severity | Area | Finding |
|---|---|---|---|
| 1 | High | `GET /api/getUserDetailByEmail` | Returns a user's full personal details (name, date of birth, address, phone) to anyone who knows the email. No password or token is required. |
| 2 | Medium | `POST /api/createAccount` | Accepts an invalid email format (an account exists with the email `notanemail`, which has no `@`). |
| 3 | Medium | `POST /api/createAccount` | Accepts a country (`Nigeria`) that is not offered in the website's signup Country dropdown, so country is not validated (confirmed manually against the dropdown). |
| 4 | Medium | All endpoints | Error responses return HTTP `200`; the real code (400/404/405) is only in the body's `responseCode`. |
| 5 | Low | All endpoints | `Content-Type` is `text/html; charset=utf-8` although the body is JSON. |
| 6 | Low | `GET /api/brandsList` | Returns 34 entries but only 8 distinct brands (one entry per product, with duplicates such as "Polo" ×6). |
| 7 | Low | `POST /api/verifyLogin` | The same message is returned whether the email or the password is missing, so the error does not say which field is absent. |
| 8 | Info | `POST /api/searchProduct` | An empty `search_product` value returns all products instead of a 400 error. |
| 9 | Info | `POST /api/searchProduct` | Searching "top" also returns shirts, because the search matches the category ("Tops & Shirts"), not only the product name. |
