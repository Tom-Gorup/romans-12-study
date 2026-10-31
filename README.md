# Romans 12 — annotated study

A scroll-driven Bible study presentation built with HTML, CSS, and JavaScript in `dist/`.

## Preview locally

```sh
python3 -m http.server 8765 --directory dist
```

Open `http://localhost:8765/`. Scroll or press the right/down arrows to advance; left/up moves backward. The connected dots jump to major sections. Scripture remains selectable and copyable.

## Publish

Vercel serves `dist/` as a static site, as configured in `vercel.json`. The `main` branch of [Tom-Gorup/romans-12-study](https://github.com/Tom-Gorup/romans-12-study) is connected to the production Vercel project. Commit changes and push `main` to trigger a new deployment:

```sh
git add .
git commit -m "Update Romans 12 presentation"
git push origin main
```

The production domain is `romans12.tomgorup.com`.
