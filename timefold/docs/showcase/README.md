# Showcase captures

[Project README](../../README.md) · [Documentation home](../README.md) · [Asset sources](../../ASSET_SOURCES.md)

These images are screenshots of the running TIMEFOLD application. They show the project's own procedural scene, interface, illustrations, and fictional sample content. They are documentation assets, not imported reference artwork or AI-generated concept images.

The desktop captures use a **1440 × 1000** viewport; the mobile capture uses **390 × 844**. Ambient motion was disabled for stable framing after the requested chapter rendered. These still images demonstrate the final scene and responsive layout; they do not measure animation frame rate.

| Image | View shown |
| --- | --- |
| [timefold-1998.webp](timefold-1998.webp) | Desktop room in the childhood chapter, with warm past-era atmosphere |
| [timefold-2026.webp](timefold-2026.webp) | Desktop room in the present chapter, used as the README's main showcase |
| [timefold-2056.webp](timefold-2056.webp) | Desktop room in the imagined future chapter, with cool blue atmosphere |
| [traveller.webp](traveller.webp) | The traveller detail panel and its era-specific portrait/story |
| [mobile.webp](mobile.webp) | The responsive scene and navigation in a mobile viewport |

## Refreshing a capture

1. Run `npm ci` and `npm run dev` from the project folder, then open Vite's local URL.
2. Disable ambient motion in About and select the appropriate year. Let the requested view render, close any unrelated dialogs, and move the pointer away from the scene to avoid a hover label in the room images.
3. Capture the application viewport. For the traveller image, open the person collection; for the mobile image, use a narrow device viewport and verify that the timeline remains visible.
4. Export to WebP using the same filename. Keep text legible and avoid adding personal browser chrome, development overlays, or unrelated material.
5. Check the root README's image layout, then run `npm run docs:generate` and `npm run docs:check` to refresh the file inventory and validate the links.

Screenshots preserve the app's visual provenance: its original procedural content, licensed fonts, and Three.js rendering remain subject to the [rights and reuse notes](../rights/README.md). A screenshot does not add a new whole-project license.
