# Romans 12 — annotated study

A scroll-driven first pass at a Bible study presentation. It opens on all of Romans 12, moves into verse 1, then draws a circle and connector to a handwritten reflection question.

## Preview locally

```sh
python3 -m http.server 8765 --directory dist
```

Open `http://localhost:8765/`. Scroll or press the right/down arrows to move through five pause points; left/up moves backward. Each transition eases through the drawing. Text can be selected normally, and the footer button copies the chapter or verse 1. The source is buildless HTML, CSS, and JavaScript in `dist/`.

## Sequence

1. Opening ∴ symbol and Romans 12 title
2. Whole chapter overview
3. Verse 1 close-up with **therefore**, **mercies of God**, and **living sacrifice** emphasized
4. Circle around “mercies of God”
5. Connector and handwritten reflection question

Scroll progress drives each element in `dist/app.js`, so annotations can be added as later stages.
