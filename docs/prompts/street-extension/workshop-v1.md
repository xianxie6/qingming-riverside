# 市井小戏素材 · 内置 image_gen 提示词

2026-10-15。以下四次均使用内置 `image_gen`；生成稿和压缩浏览素材的位置见 [场景说明](../../STREET-WORKSHOP.md)。

## 1. warehouse-clean-v1

编辑目标：`assets/extension-preview/east-near.webp`。`transparent_background=false`。

```text
Use case: precise-object-edit. Edit target: this exact long Song dynasty painted waterfront warehouse panorama. Produce a clean background plate for an interactive crane. Preserve the full composition, exact aspect ratio, all architecture, fine ink lines, paper texture and colours. Change ONLY the very small hanging crane area at the far LEFT: remove the vertical hanging rope/chain and its suspended small round cargo bundle below the crane tip, approximately x=215..274,y=220..411 in the 1939x811 original. Repaint the background roof tiles, wood wall and stacked timber behind those removed elements seamlessly. KEEP the crane's diagonal wooden boom, its upright timber mast, the crane tip pulley at x245,y210, all nearby stacked logs and cargo on the ground intact. Do not add any people. No text. The only changed pixels should be in that narrow strip below the pulley. Output the complete original panorama with the clean patch, not a close-up, no border, same viewpoint.
```

## 2. inn-open-v1

编辑目标：`assets/extension-preview/east-far.webp`。`transparent_background=false`。

```text
Use case: precise-object-edit. Edit target: this exact long Chinese Song dynasty inn waterfront panorama. Preserve exact full composition, ratio, all fine painted ink lines, paper texture and colour. Change ONLY the pair of closed wooden doors in the small tile-roof courtyard gateway just to the RIGHT of the main inn, approximately x=825..918,y=375..477 in the 1942x809 original. Replace those wooden door leaves by a quiet shadowed OPEN guest-room doorway: dark warm wooden interior, one straw mat low wooden bench, a travel bundle in the rear, discreet warm muted tones. Keep doorway width and frame, the little tiled roof and surrounding plaster walls perfectly unchanged. NO people, no hanging cloth yet, no modern details, no text. Do not change the large main inn on the left or the willow trees on the right. Output the full original panorama with this one tiny open interior, not a crop, no border.
```

## 3. curtain-v1

风格参考：`assets/extension-preview/east-far.webp`。`transparent_background=true`。

```text
Use case: historical-scene. Asset type: a SINGLE isolated two-leaf hanging cloth curtain sprite for a small doorway in the attached Song dynasty ink painting game (reference for style ONLY). A modest rectangular warm ochre linen doorway curtain, TWO equal narrow leaves meeting at a vertical seam in the middle, both hanging straight and closed. A thin dark wooden rod across the top, two tiny fabric loops. Front view, flat 2D miniature traditional Chinese fine ink outlines, muted aged-paper ochre and olive brown, delicate vertical folds and plain woven texture matching reference. NO wall, NO doorframe, NO scene, NO people, NO shadows outside object, NO ground, no text. Sprite alone centered with generous transparent margin, real transparent alpha. Proportions: curtain approximately 90 wide and 100 tall in the game, two cloth leaves each 45 wide. Clean outer outline suitable for cutting at center and gathering each side to open. Do not put a fringe or busy ornaments. All non-object pixels transparent.
```

## 4. cargo-v1

风格参考：`assets/extension-preview/east-near.webp`。`transparent_background=true`。

```text
Use case: historical-scene. Asset type: SINGLE isolated small horizontally oblong burlap grain parcel for a Song dynasty warehouse crane in the reference ink painting game (reference for style only). One warm tan linen sack bulging with grain, tied by two dark hemp straps, seen in the same frontal slight high viewpoint as this painting's cargo. Delicate brown ink outlines, desaturated ochre watercolour, subtle fabric weave. Approximate aspect width:height 1.65:1. No crane, no hook, no hanging ropes extending above, no background, no people, no ground, no cast shadow outside object, no text. Centered compact sprite on a genuinely transparent background, clean alpha edges, no white background. Match existing miniature painted grain sacks, not a shiny rendered 3D prop.
```
