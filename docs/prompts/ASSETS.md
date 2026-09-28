# 第五版素材与提示词

第七版主角与船工：`art-source/images/featured-characters-v7.png`。生成及背景修正提示词见 `docs/prompts/FEATURED-PROMPTS.md`，使用内置 imagegen。

生成方式：内置 imagegen。原始街景保留在 assets/street.png。

最终素材：
- assets/street-empty.png：中央街区无人背景，2172×724。
- assets/district-west.png：西侧水磨、陶作与织坊，2172×724。
- assets/district-east.png：东侧货市、城门与仓场，2172×724。
- assets/people-ink.png：十二种人物姿态，1536×1024。使用 people-masks.js 中的矢量轮廓在运行时裁剪、分层变形；原始素材保留白底。

## 中央背景

Use case: precise-object-edit.
Asset type: clean background plate for animation.
Edit target: the supplied 2172 x 724 panoramic Song dynasty riverfront painting.
Remove EVERY human figure from the entire image, including all tiny diners on the second-floor teahouse balcony, everyone inside food stalls, every person standing on the bridge, all pedestrians along the street, and all people at the right edge. Remove the small dog too. Fill their silhouettes with the correctly reconstructed background walls, interiors, pavement, chairs, and tables.
Absolutely preserve the existing image layout and registration: same 3:1 canvas, identical bridge silhouette and position, identical buildings, roofs, tree trunks, balcony rails, stone riverbank, stairs, furniture, awnings, paper color and ink details. This is localized object removal, not redrawing/reinterpreting the scene. Keep ALL architecture in the exact original locations and scale. Keep tables, cups and baskets. The river remains empty. No humans anywhere, no silhouettes, no replacement people, no boats, no text or marks. Output only the edited painting.

## 西侧街区

Use case: historical-scene. Asset type: additional background panel for a horizontally scrollable Chinese handscroll game.
Reference image: supplied central neighborhood, for identical drawing style, ink colors, paper texture, scale and side-elevation perspective. Generate a DIFFERENT adjoining district, not a copy of the reference.
Wide 3:1 panoramic canvas. World reference coordinates 2172 by 724: the continuous walkable street runs at y=477 all the way across, stone quay top at y=493, river water below y=525, paper sky in upper 20%. Buildings and people scale must match reference. Straight-on facade/elevation with modest roof depth, not overhead or isometric. Fine warm dark-grey ink contour lines, precise tiled roofs, dry-brush hatching, pale moss green and faded ochre on light warm ivory paper, subdued saturation.
Very important: NO PEOPLE and NO ANIMALS anywhere, including windows and shops, because every inhabitant will be animated as a separate layer later. Keep working tables, stools, baskets, pottery, racks and market objects. No boats in the river. No lettering, calligraphy, labels, seals, UI, borders, watermark, red lanterns, fantasy towers or glossy rendering. One continuous landscape, no panels.
This is the WESTERN extension. Compose from left to right: a small rural lane beside enclosed vegetable gardens and mulberry trees; a low timber watermill with a clearly visible round wooden water wheel near x=610 y=495, river below; a cluster of open pottery and weaving workshops, pottery on shelves and cloth on racks; an open covered produce market with baskets and scales; low timber dwellings, thinning into large willow trees at the far right edge so this joins the willow-tree left edge of the reference. Keep a clear continuous street at the specified y=477. Walls and roofs varied but all modest Song dynasty buildings.

## 东侧街区

Use case: historical-scene. Asset type: additional background panel for a horizontally scrollable Chinese handscroll game.
Reference image: supplied central neighborhood, for identical drawing style, ink colors, paper texture, scale and side-elevation perspective. Generate a DIFFERENT adjoining district, not a copy of the reference.
Wide 3:1 panoramic canvas. World reference coordinates 2172 by 724: the continuous walkable street runs at y=477 all the way across, stone quay top at y=493, river water below y=525, paper sky in upper 20%. Buildings and people scale must match reference. Straight-on facade/elevation with modest roof depth, not overhead or isometric. Fine warm dark-grey ink contour lines, precise tiled roofs, dry-brush hatching, pale moss green and faded ochre on light warm ivory paper, subdued saturation.
Very important: NO PEOPLE and NO ANIMALS anywhere, including windows and shops, because every inhabitant will be animated as a separate layer later. Keep working tables, stools, baskets, pottery, racks and market objects. No boats in the river. No lettering, calligraphy, labels, seals, UI, borders, watermark, red lanterns, fantasy towers or glossy rendering. One continuous landscape, no panels.
This is the EASTERN extension. Compose from left to right: low waterside timber shops matching the reference's right edge; a busy-looking but unoccupied goods market with scales, cloth awnings, baskets and racks; taller two-storey wooden shop houses; a solid Song dynasty brick city gate with a wide open arch facing straight toward the viewer, centered around x=1380 with the ground at y=477, low walls continuing to the sides; a warehouse and freight yard beside the river at the far right. Leave the street horizontally walkable in front of the gate; no abrupt hills. Richly detailed merchandise, architecture and courtyard interiors, but absolutely no figures or boats.

## 人物素材

Use case: historical-scene. Asset type: TRANSPARENT PNG character sprite atlas for the supplied ink-painting game.
Reference image supplies style only: Song dynasty people with exceptionally fine warm grey brush contours, cross-hatched robe folds, subdued moss green, faded brown, blue grey and undyed linen, light ink wash, realistic miniature historical drawing proportions. Match the painting; avoid simple vector cartoons.
Create exactly TWELVE isolated full-body character sprites in a rigid 6-column by 2-row grid, one centered sprite per cell, ample clear space around each, no overlaps. Canvas 3:2. ALL backgrounds truly transparent alpha, not paper, not a checkerboard. No ground shadows, floor, tables, chairs, buildings, scenery, text, numbered labels, borders.
Top row left to right:
1 male pedestrian in moss green long robe, profile walking right.
2 male pedestrian in muted blue grey long robe, profile walking right.
3 woman in ivory upper robe and faded brown long skirt, walking right.
4 porter with shoulder pole and two suspended woven baskets, walking right; entire pole and baskets must fit inside the cell.
5 standing food vendor in faded ochre robe holding a small tray forward.
6 standing tea server in grey-green robe holding a small kettle with forward hand.
Bottom row left to right:
7 seated diner in ivory robe, facing right, knees bent, one hand holding a tiny cup near chest, no chair.
8 seated diner in brown robe, facing left, knees bent, gesturing hand forward, no chair.
9 seated shopkeeper in moss green robe, facing right, inspecting a small ceramic bowl, no chair.
10 standing merchant in dark blue grey robe talking with one hand slightly raised.
11 child in a modest muted green short robe walking right, child proportions.
12 worker in faded ochre robe, leaning forward slightly, both hands working in front of waist.
Each body separate with transparent empty pixels all around. Full top of head to both feet included. Ink miniature figures, detailed faces and cloth, no photographic realism, no modern hair/clothing, no fantasy costumes.

## 人物最终白底处理

Edit this exact character atlas. Replace ONLY the entire grey-and-white checkerboard with perfectly uniform pure white (#FFFFFF). Every background pixel must be clean white, including gaps between arms, legs, cups, ropes and baskets. No checkerboard, no transparency grid, no texture, no shadows. Preserve the twelve figures, all details, the 1536 x 1024 canvas, and their exact sizes and positions unchanged. This is a white-background ink sprite sheet. Do not redraw the people.
