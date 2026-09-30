# 09 - Five JavaScript SDK tricks

Everything happens in `public/index.html`; the server is the same as 05.

| # | Trick | API |
|---|---|---|
| 1 | Hide filter pane and page navigation | `settings.panes` via `report.updateSettings()` |
| 2 | Transparent background | `models.BackgroundType.Transparent` |
| 3 | Filter from your own UI | `report.setFilters()` with a basic filter |
| 4 | React to clicks | `report.on('dataSelected', ...)` |
| 5 | Save and restore views | `report.bookmarksManager.capture()` / `applyState()` |

```bash
npm run ep09
```

For trick 3, type a table, column and value that exist in your model.
Trick 2 shows best with a transparent page background set in the report itself.
