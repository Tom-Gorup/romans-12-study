# Romans 12 verse-slide standard

Romans 12 has three major thematic sections:

1. **Romans 12:1–2:** Therefore, worship God with your whole life.
2. **Romans 12:3–8:** Therefore, serve humbly according to God’s grace.
3. **Romans 12:9–21:** Therefore, embody genuine love in every relationship.

Each section has one persistent title with a small three-dot mark and one large navigation circle. The opening, chapter overview, Romans background, book map, three-step gospel sequence, and three-response overview also have large circles. Smaller circles jump to the reading, reflection, and summary beats within a theme. Use verse 1 as the template for the reading beats.

| Element | Standard |
| --- | --- |
| Reading area | Scripture sits in the left column, aligned within the same slide inset on every verse slide. The right column is reserved for annotations. |
| Scripture type | Georgia at the shared `--scripture-size` with 1.23 line height. Verse numbers and bold emphasis use the same burnt orange throughout. |
| Citation | Place `ROMANS 12:… · ESV` directly below the scripture, aligned to the left edge. Use the shared citation spacing and style. |
| Reflection | Add drawings and handwriting only when that reflection is active. Keep them in the right column and connect them to the relevant words. Do not add a “REFLECT” label. |
| Text behavior | Keep scripture selectable and copyable. Annotation SVGs must not intercept pointer events. |
| Long passages | Keep one continuous, selectable paragraph. Fit the entire passage on one slide at a slightly smaller size. Keep the citation and avoid panning, progressive reveals, tables, and dividers. |
| Small screens | Stack the reading and annotation areas. Keep the same 7% side inset and shared mobile scripture size. |

The shared CSS variables and layout rules are in `dist/enhancements.css` under “Shared verse-slide standard.” Use those variables for future changes instead of slide-specific font or positioning overrides. Verses 1–2 form one paragraph; scrolling advances their annotation states without replacing either verse, then shows the body, mind, and allegiance summary. Verses 3–4 and 5–8 each form one selectable paragraph with a reading beat and an annotation beat. Verses 9–13 and 14–21 each form one selectable paragraph with a full-width reading area. A companion action slide follows each love passage; the three-response overview returns as the closing slide.
