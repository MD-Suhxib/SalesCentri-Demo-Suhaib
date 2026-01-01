# Clear Next.js/Turbopack Cache

If you're experiencing import errors that persist even after fixing the code, follow these steps:

## Steps to Clear Cache:

1. **Stop the dev server** (Press Ctrl+C in the terminal)

2. **Delete the .next folder** (if it exists):
   ```powershell
   Remove-Item -Recurse -Force .next
   ```

3. **Restart the dev server**:
   ```powershell
   npm run dev
   ```

## Alternative: Full Clean

If the above doesn't work, try a full clean:

```powershell
# Stop dev server first (Ctrl+C)

# Remove .next folder
Remove-Item -Recurse -Force .next

# Remove node_modules cache (if exists)
Remove-Item -Recurse -Force node_modules/.cache

# Restart dev server
npm run dev
```

## Why This Happens

Turbopack (Next.js's bundler) caches module resolutions for performance. Sometimes it can cache incorrect import paths. Clearing the cache forces it to re-analyze all imports from scratch.

