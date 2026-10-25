# solid-refresh: renaming a component on Vite

Minimal repro for two solid-refresh HMR bugs on Vite. `repro.mjs` edits the text of `Page`, renames it to
`RenamedPage`, edits the text again, and prints the DOM after each step.

```sh
npm install
npx playwright install chromium   # or set CHROME_PATH
npm run repro
```

solid-refresh 0.7.8 (and every release since 0.7.4): the page keeps showing the pre-rename content.

```
v2         v2
rename v3  v2   (invalidate logged)
v4         v2   (invalidate logged)
```

solid-refresh 0.7.3 (set `"overrides": { "solid-refresh": "0.7.3" }`, reinstall): content is right, but every update
after the rename invalidates again.

```
v2         v2
rename v3  v3   (invalidate logged)
v4         v4   (invalidate logged)
```

Expected: `v2`, `v3`, `v4`, with an invalidation for the rename only.
