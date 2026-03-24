# Design System Document: The Ethereal Atelier

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"
This design system rejects the "template-heavy" nature of traditional e-commerce. It treats the viewport not as a grid of products, but as a high-end gallery space. The objective is to create an experience that feels **bespoke, quiet, and intentional**. 

To move beyond "standard" UI, we utilize **intentional asymmetry**. Aligning text to a staggered 12-column grid and allowing high-resolution imagery to bleed off-canvas creates a sense of "editorial flow" found in physical lookbooks. By overlapping glassmorphic containers over ambient glows, we achieve a depth that feels atmospheric rather than structural.

---

## 2. Colors & Surface Architecture

The palette is rooted in the natural tones of Alabaster, Soft Charcoal, and Muted Sage, utilizing Material Design naming conventions for systematic implementation.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or defining component boundaries. 
*   **How to define space:** Use background color shifts. A section using `surface-container-low` (#f5f3ed) should sit directly against a `surface` (#fbf9f3) background. The transition is the boundary.
*   **The "Glass & Gradient" Rule:** Main CTAs and featured hero sections must utilize a subtle linear gradient (e.g., `primary` to `primary-container`) to provide "soul" and a soft metallic sheen.

### Surface Hierarchy (Nesting)
Treat the UI as stacked sheets of fine, semi-translucent paper.
1.  **Base Layer:** `surface` (#fbf9f3) - The primary canvas.
2.  **Sectional Layer:** `surface-container-low` (#f5f3ed) - Used for large content blocks.
3.  **Component Layer:** `surface-container-highest` (#e4e2dd) - For elevated cards or navigation elements.
4.  **Floating Layer:** Glassmorphism using `surface` at 70% opacity with a `24px` backdrop-blur.

---

## 3. Typography: Editorial Authority

We pair the architectural rigidity of **Clash Display** with the modern legibility of **Satoshi**.

*   **Display & Headlines (Clash Display):** Used for "Moments of Impact." These should be set with tight letter-spacing (-0.02em) and high contrast in scale. `display-lg` (3.5rem) should be used sparingly to command attention.
*   **Body & Titles (Satoshi):** Used for "Information Delivery." Satoshi provides a neutral, high-end readability that mimics luxury print media.
*   **The Signature Scale:** We utilize a "High-Contrast" hierarchy. Do not be afraid of large gaps between headline and body sizes; the white space is what allows the typography to breathe.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows feel "heavy." In this system, we use light and opacity to define hierarchy.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a Cart Drawer) requires a shadow, it must be `on-surface` at 4% opacity with a 60px blur. It should feel like a soft glow, not a drop shadow.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline-variant` (#c5c7bf) at **15% opacity**. Never use 100% opacity.
*   **Glassmorphism:** All overlays must use `backdrop-filter: blur(24px)`. This integrates the UI into the background imagery, making the product photography the star of the show.

---

## 5. Components & UI Patterns

### Buttons (The "Pill" Standard)
*   **Primary:** `primary` (#605e5b) background, `on-primary` (#ffffff) text. 40px (`xl`) border radius. Transition: `cubic-bezier(0.16, 1, 0.3, 1)`.
*   **Secondary:** Glassmorphic background (70% `surface`) with a "Ghost Border."
*   **Hover State:** A subtle "Ambient Glow" (Muted Sage #8C9386 at 20% opacity) should appear behind the button.

### Cards & Product Grids
*   **Forbidden:** Divider lines or boxed borders.
*   **Spacing:** Use `Spacing 8` (2.75rem) between cards.
*   **Interaction:** On hover, the image should subtly scale (1.05x) while the card container gains a `surface-container-highest` background shift.

### Input Fields
*   **Style:** Minimalist underline or soft-tinted background (`surface-container-lowest`). 
*   **Focus:** Instead of a heavy border, the label should shift to `primary` (#605e5b) and the background should subtly brighten.

### Signature Component: The "Floating Lookbook"
A horizontal scroll component where images overlap with `40px` rounded corners. Typography (Clash Display) is placed on a glassmorphic card that floats over the junction of two images.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Generous White Space:** If you think there is enough space, add 20% more.
*   **Leverage Fluid Motion:** Every state change (hover, page transition) must use the signature `cubic-bezier(0.16, 1, 0.3, 1)` for a "weighted" feel.
*   **Asymmetry:** Place product descriptions off-center to create an editorial, boutique feel.

### Don't:
*   **Don't use pure black:** Use `Soft Charcoal` (#21201E) for all "black" text to maintain a high-end, soft-touch look.
*   **Don't use 1px lines:** Even for tables or lists, use background tonal shifts (`surface-variant`) instead of lines.
*   **Don't crowd the edges:** Maintain a minimum page margin of `Spacing 16` (5.5rem) on desktop to frame the content like a luxury magazine.

---

## 7. Motion & Interaction
The "Soul" of the system is the **Fluid Motion**. Every element should feel like it is floating in a high-viscosity liquid.
*   **Entrance:** Elements should slide up `20px` while fading in.
*   **Speed:** 600ms duration with `cubic-bezier(0.16, 1, 0.3, 1)`. 
*   **Micro-interactions:** Subtle ambient glows (Muted Sage) should track the mouse cursor slightly behind the actual pointer, creating a "magnetic" feel.