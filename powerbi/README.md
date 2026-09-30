# Sample report

`Embedded Sample.pbip` is the report used in every demo. It's a Power BI project
(PBIP), so the model and report are plain text and diff nicely in Git.

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

**RLS role `Customer`:** `[CustomerKey] = USERNAME()` on Customers. The embed token
passes the customer key as the username, so `customer-a` only sees Alpine Retail.

**RLS role `All Customers`:** no filter. Once a model has RLS, a service principal has
to pass an identity for every embed token. The samples that aren't about RLS use this
role (`DEFAULT_ROLE` in `.env`).

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

1. Open `Embedded Sample.pbip` in Power BI Desktop and click Refresh.
2. Modeling > View as > Customer, other user `customer-a`: only Alpine Retail shows.
3. Publish to the workspace your service principal can access.
4. Copy the report ID from the URL (`.../reports/<REPORT_ID>/...`) and the workspace ID
   (`.../groups/<WORKSPACE_ID>/...`) into `.env`.

For the filter demos (09 and 13) use table `Customers`, column `Region`, value `Europe`.
