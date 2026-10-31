# Romans 12 verse-slide standard

Use the verse 1 slide as the template for every verse slide. The opening, chapter overview, book map, and “therefore” sequence are distinct presentation sections.

| Element | Standard |
| --- | --- |
| Reading area | Scripture sits in the left column, aligned within the same slide inset on every verse slide. The right column is reserved for annotations. |
| Scripture type | Georgia at the shared `--scripture-size` with 1.23 line height. Verse numbers and bold emphasis use the same burnt orange throughout. |
| Citation | Place `ROMANS 12:… · ESV` directly below the scripture, aligned to the left edge. Use the shared citation spacing and style. |
| Reflection | Add drawings and handwriting only when that reflection is active. Keep them in the right column and connect them to the relevant words. Do not add a “REFLECT” label. |
| Text behavior | Keep scripture selectable and copyable. Annotation SVGs must not intercept pointer events. |
| Long passages | Keep the shared type scale and split a long reading into navigable slides if it cannot fit. Do not shrink only one slide or introduce a table or divider. |
| Small screens | Stack the reading and annotation areas. Keep the same 7% side inset and shared mobile scripture size. |

The shared CSS variables and layout rules are in `dist/enhancements.css` under “Shared verse-slide standard.” Use those variables for future changes instead of slide-specific font or positioning overrides. Verse 2 keeps its two annotation states and verses 3–5 keep the expansion animation within this layout.
