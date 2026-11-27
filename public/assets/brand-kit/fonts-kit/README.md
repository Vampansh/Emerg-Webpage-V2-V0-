# EMERG — Official Typography & Fonts Kit

This directory contains the complete font specifications, web font integrations, and CSS stylesheets for the **EMERG** brand identity.

---

## 1. Font Breakdown from Official Logo

The official EMERG logo features two distinct typographic styles:

### A. Wordmark: "EMERG"
* **Style:** Architectural Geometric Sans-Serif (All-Caps)
* **Visual Characteristics:**
  * Clean, geometric lines with even horizontal strokes.
  * Symmetrical 'E' with equal upper and lower bars.
  * Wide-set 'M' with center vertex meeting the baseline.
  * Circular 'G' with internal horizontal crossbar.
* **Exact Web & Print Font Match:** **Montserrat Bold (700)** / **Plus Jakarta Sans (700)**
* **License:** SIL Open Font License (100% Free for commercial use).
* **Direct Download:** [Google Fonts — Montserrat](https://fonts.google.com/specimen/Montserrat)

---

### B. Tagline: "Unfold Possibilities"
* **Style:** Elegant Humanist Neo-Grotesque (Sentence Case / Title Case)
* **Visual Characteristics:**
  * Clean, open apertures for maximum legibility on digital screens.
  * Friendly, balanced letter proportions with subtle organic warmth.
* **Exact Web & Print Font Match:** **Inter Medium (500)** / **Open Sans (400)**
* **License:** SIL Open Font License (100% Free for commercial use).
* **Direct Download:** [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)

---

### C. Technical & Monospace (for Docs & Code)
* **Font:** **JetBrains Mono**
* **Usage:** API documentation, terminal interfaces, code snippets.
* **Direct Download:** [Google Fonts — JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 2. Web Integration Snippet

Include this directly in your HTML `<head>` tag:

```html
<!-- EMERG Official Typography Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="typography.css">
```

---

## 3. Typographic Hierarchy Scale

| Role | Font Family | Weight | Size | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Wordmark** | Montserrat | Bold (700) | `48 px` | `1.0` | `+0.16em` (All-Caps) |
| **Tagline** | Inter | Medium (500) | `18 px` | `1.3` | `+0.04em` |
| **Hero H1** | Montserrat | Bold (700) | `56 px` | `1.1` | `-0.02em` |
| **Section H2**| Montserrat | SemiBold (600) | `36 px` | `1.2` | `-0.01em` |
| **Body Large**| Inter | Regular (400) | `18 px` | `1.6` | `0em` |
| **Body Copy** | Inter | Regular (400) | `15 px` | `1.6` | `0em` |
| **Code / CLI** | JetBrains Mono| Regular (400) | `13 px` | `1.5` | `0em` |

---

## 4. Included Files

* [`typography.css`](typography.css) — Ready-to-import production CSS file with all variables and helper classes.
* [`font-specimen.html`](font-specimen.html) — Interactive HTML specimen sheet to preview all weights, sizes, and pairings live in the browser.
