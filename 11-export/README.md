# 11 - Export embedded reports to PDF and PowerPoint

The Export To File API renders the report in the Power BI service and returns a file.
Pass the bookmark state captured in the browser and the export matches what the user
sees: filters, slicers, current page.

```bash
npm run ep11
```

## Walkthrough

1. Set some filters in the report.
2. `public/index.html`: `report.bookmarksManager.capture()` gives the state.
3. `shared/powerbi.js`, `exportReport()`: start the job (`ExportTo`), poll the status, download the file.
4. Click Export PDF, open it: same filters.
5. Click Export PowerPoint.

## Requirements

- Workspace on an F, A or P capacity (not Pro, not PPU).
- Tenant setting "Export reports as PowerPoint presentations or PDF documents" (on by default).
  PNG needs "Export reports as image files".
- Reports with a sensitivity label can't be exported by a service principal.
- Exports run in the background on your capacity and count toward its load.
