# 13 - Embed a single visual

The same embed token that shows a whole report can show one visual from it.
Change the config to `type: 'visual'` and add `pageName` and `visualName`.

```bash
npm run ep13
```

## Walkthrough

1. The full report loads. Click "List visuals on this page": names and titles appear
   in the sidebar and as a table in the console (`page.getVisuals()`).
2. Tick three visuals, click "Embed selected": three separate embeds in your own layout.
3. Type a table, column and value, "Apply to all": your app filters every visual at once.

Tip: note the `visualName` values once and hard-code them in your app. They stay the
same until someone deletes and recreates the visual.
