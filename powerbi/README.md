# Sample report

The report used in every demo, in two versions:

| Project | Row-level security | Used by | `.env` |
|---|---|---|---|
| `Embedded Sample.pbip` | none | 01 to 05, 09 to 13 | `REPORT_ID` |
| `Embedded Sample RLS.pbip` | roles `Customer` and `All Customers` | 06, 12, 14, 16 | `RLS_REPORT_ID` |

They're identical apart from the roles, so the early videos don't have to deal with RLS.
Both are Power BI projects (PBIP): the model and report are plain text and diff nicely
in Git. If you change the layout or the model, change both.

The data is generated inside Power Query, so there is no data source, no gateway
and no credentials to set up. Refresh works in the service as is.

## Model

| Table | Contents |
|---|---|
| Customers | 6 customers, `customer-a` to `customer-f`, with Region and Industry |
| Products | 8 products in 3 categories (Subscriptions, Services, Add-ons) |
| Calendar | 2025-01-01 to 2026-12-31, marked as date table |
| Sales | Monthly sales per customer and product, Jan 2025 to Sep 2026 |

Measures: Revenue, Units, Active Customers, Revenue per Customer. Every table and
measure has a description; keys are hidden; the date table is marked.

RLS version only:

- **Role `Customer`:** `[CustomerKey] = USERNAME()` on Customers. The embed token
  passes the customer key as the username, so `customer-a` only sees Alpine Retail.
- **Role `All Customers`:** no filter. Once a model has RLS, a service principal has
  to pass an identity for every embed token, including for users who may see
  everything. `16-edit-mode` uses it for the admin view.

## Report

- **Sales overview:** Region and Year slicers, four KPI cards, revenue by month,
  revenue by customer.
- **Products:** revenue by category, revenue by product, units sold by month.

Design:

- Colours from the Embedsy logo: brand yellow for data, the logo grey for secondary
  series, a darker grey for text. Theme: `StaticResources/RegisteredResources/Embedsy.json`.
- The header, logo and white panels are one background image per page
  (`Background*.png`). Visuals are transparent and sit exactly on the panels, so
  keep their positions if you edit the layout.
- Every visual has a title and alt text, a logical tab order, data labels instead
  of a value axis, and sorted categories.

Every visual has a title, so `page.getVisuals()` in `13-single-visual` lists them by name.

## Publish

Do this for both projects:

1. Open the `.pbip` in Power BI Desktop and click Refresh.
2. RLS version only: Modeling > View as > Customer, other user `customer-a`: only
   Alpine Retail shows.
3. Publish to the workspace your service principal can access.
4. Copy the report ID from the URL (`.../reports/<id>/...`) into `.env`: `REPORT_ID` for
   `Embedded Sample`, `RLS_REPORT_ID` for `Embedded Sample RLS`. The workspace ID is
   in the same URL (`.../groups/<WORKSPACE_ID>/...`).

For the filter demos (09 and 13) use table `Customers`, column `Region`, value `Europe`.
