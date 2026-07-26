# AbanobSoliman.github.io

Personal website of **Dr. Ir. Abanob Soliman** — Principal SLAM & Computer Vision Engineer.

Live at <https://abanobsoliman.github.io/>.

## Structure

Three files, no build step, no dependencies — it deploys as-is to GitHub Pages.

| File | Purpose |
| --- | --- |
| `index.html` | All content and markup, plus JSON-LD `Person` structured data |
| `style.css` | Design tokens, console layout, light/dark themes, print stylesheet |
| `script.js` | Tabs, theme, publication filter, and the live map viewer |
| `img/` | Portrait and favicon |

## Layout

The page is a **ground control station**, the interface this subject already works in.

- A fixed **left rail** holds identity and the live map. It never changes.
- A **right stage** holds six tabs. On desktop each panel is absolutely positioned
  inside a fixed-height box and scrolls internally, so switching tabs never resizes
  or scrolls the page.
- Below 1024px the two columns stack and the page scrolls normally; the tab strip
  becomes sticky and scrolls horizontally.

Tabs follow the ARIA tabs pattern — click, arrow keys, Home/End — and mirror the open
tab into the URL hash, so `/#research` is a real link and browser back works.

## The map

A sparse SLAM viewer drawn on `<canvas>` in plain JavaScript:

- landmark cloud built as **vertical structure standing on a ground plane**, which is
  what makes it read as a mapped corridor rather than a uniform cloud
- the estimated trajectory, registered **keyframe poses** as camera frustums
- **loop-closure constraints** between keyframes close in space but far apart in time
- the pose being estimated now, with feature-association rays and an uncertainty ellipse
- a live pose readout and HUD counters

It is seeded, so the map is identical on every visit. Drag to orbit; it resumes drifting
when you let go. The legend under the canvas names each mark, so the map reads as a
diagram rather than decoration.

The seven **milestone keyframes** correspond to the roles on the Experience tab —
hovering a role lights its keyframe in the map.

## Design

- **Palette** — cool drafting-paper light (`#EEF2F8`) with a single burnt-amber accent
  (`#A84D08`). Dark is a navy night-flight variant.
- **Type** — Instrument Serif for display, IBM Plex Sans for body, IBM Plex Mono for data.

Colours live in CSS custom properties on `:root` / `[data-theme]`. The canvas reads the
same variables, so the theme toggle recolours the visualisation too.

## Behaviour notes

- **Light is the default for everyone.** The OS `prefers-color-scheme` is deliberately
  not consulted; dark is opt-in via the toggle and remembered afterwards.
- Renders fully without JavaScript — the tab strip hides and every panel stacks into one
  long page.
- `prefers-reduced-motion` is respected: the map renders a single static frame and all
  transitions are disabled.
- The map pauses when scrolled out of view, when the tab is hidden, or via its pause button.
- Printing flattens every tab into a clean black-on-white CV document.

## Content policy

**The CV is deliberately not published here.** It is shared on request, so the site links
`mailto:` rather than a PDF. Do not commit the CV — anything added to this repository is
public and stays in the git history.

Site copy describes **capability and outcome**, not implementation detail. Employer
specifics are kept off the public page: no hardware bills of materials, no vendor or
silicon choices, no performance benchmarks, no named funding programmes or market
pipeline, and no description of the methods behind an employer's differentiator. Keep new
entries to that standard.

## Keeping it current

When a role or paper changes, update the matching panel in `index.html` — experience
entries under `.track` (each `data-kf` index maps to a milestone keyframe in the map),
publications under `#pubs` (each carries a `data-type` used by the filter; the counts in
the filter chips are written by hand).

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## License

Code may be reused. All content — text, CV and images — belongs to Dr. Ir. Abanob Soliman;
please replace personal data and images if you reuse this.
