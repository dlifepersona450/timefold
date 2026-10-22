[Docs home](../README.md) · [Learning path](README.md) · Previous: [interaction](05-interaction.md) · Next: [game](07-game.md)

# 6. Build the same person at different ages

The dramatic idea is continuity of identity: tools change around a recognizable inhabitant. The implementation achieves this with authored appearance data and procedural stage-specific groups, plus a matching SVG portrait in the detail panel.

## Start with one appearance record

Read `PersonState` in [the data reference](../reference/archive.md). Numeric age, life-stage enum, colors, and prose have different responsibilities. The sample person is fictional, born in 1988, with chapters at ages 10, 24, 38, and 68.

Changing `birthYear` updates the existing arithmetic age expressions. It does not rewrite written age labels or choose a new stage/costume. Treat those as coordinated authored choices rather than a hidden biological model.

## Build from feet upward

`createPerson` returns a `Group` with feet near Y=0 and face toward +Z. Local helpers create boxes, ellipsoids, and cylindrical limbs. A height-derived `unit` scales construction dimensions consistently.

Work in this order when reproducing it:

1. Shoes and legs establish floor contact and stance.
2. Hip/shoulder heights establish torso proportions.
3. Arms, hands, neck, and head establish a readable human silhouette.
4. Hair, eyes, brows, nose, and mouth make a face visible at the intended distance.
5. Garment/accessory pieces communicate life stage.
6. Age adjustments add proportion/posture/facial changes without changing the stable root ID.

The source's full formulas and every binding are documented in [person geometry](../reference/person.md).

## Stage and age do different things

`stage` chooses a child, young-adult, adult, or elder branch. Numeric age makes bounded adjustments within that structure. Children get a relatively larger head/shorter legs; later age can affect posture and facial creases. Hair color is authored directly.

This avoids an accidental assumption that age alone determines dress, personality, or identity. The four sample costumes are narrative choices, not universal rules about people at those ages.

## Costume must sit outside the body

A shirt, strap, lapel, or luminous seam can be mathematically present but hidden inside the torso. Compare its Z/front offset to the torso surface, not merely to the root origin. Review from the actual camera angle and at mobile size.

The sample progression uses a striped jumper/backpack, casual hoodie/messenger bag, work jacket, and long technical coat with pale seams. Changing `outfit` text does not add those meshes. Modify the branch geometry when changing the silhouette, then keep the description consistent.

## Connect it to the archive

The world places a person group in each room, gives it `userData.id = 'person'`, records its room index, and registers it in the same picking system as the desk objects. Person focus targets higher than a tabletop origin. The panel reads that era's appearance and story, not mesh internals.

## Build the second representation

`personPortrait` returns SVG rather than a Three.js mesh. It uses the same color/stage/age record but its own simplified shapes and transforms. Keeping it separate lets a readable portrait work in the HTML dialog without a second WebGL renderer.

It is not an automatic screenshot of the 3D person. A new hat or coat geometry must be added to both representations if they should match. [Portrait reference](../reference/portrait.md) documents every path group, transform, stage branch, and local binding.

## Snapshot versus continuous aging

TIMEFOLD travels between prebuilt people. It does not grow a single mesh continuously over 58 years. To implement continuous aging later, plan a rig/morph system, clothing transitions, consistent topology, and explicit interpolation rules. Keep the existing data/picking/controller contracts as the outer API.

## Practice

Change the adult jacket color and verify both mesh and portrait. Add a small accessory in both factories. Change age within a stage and inspect proportions. Test focus, floor contact, visibility, and the archive index after each change.
