# 瓦檐与布帘接缝修复

日期：2026-10-14。使用内置 image_gen 局部重绘。

参考图：art-source/street-extension/center-east-seam-reference.png。原始输出：art-source/street-extension/center-east-seam-repaired-v1.png。运行时资源：assets/extension-preview/center-east-seam-repaired-v1.webp。

修复范围：预览世界坐标 x=1985..2319、y=320..494，边缘 8 单位羽化。补丁内部完全不透明，消除原跨图渐变导致的瓦片、布帘和店内立柱重影；其余区域继续使用原图。

```text
Use case: precise-object-edit. The supplied image is the EXACT edit target, a narrow crop from a continuous Chinese Song dynasty street painting. Repair ONLY the broken shop canopy at the center, where grey roof tiles on the left dissolve into a pale cloth awning on the right, along with the doubled/ghosted support posts and display shelves beneath that join.
Replace that lower canopy with ONE coherent opaque pale warm-beige CLOTH AWNING spanning the whole shop front, from the left eave beside the pavilion to the right front support pole. It must have a continuous clean outer edge, natural restrained cloth folds, a clear attachment beneath the SECOND FLOOR, and solid wooden support posts. NO tile textures anywhere on this lower cloth awning. Retain the separate complete dark tiled roof ABOVE the second floor. Show a clear solid shop interior with pottery shelves and stools, removing only overlapping double lines from the former crossfade.
CRITICAL invariants: same portrait aspect ratio as input, identical framing and world registration. Every object outside the lower shop-front repair area stays in its EXACT original position and size. Preserve upper tiled roof, upper story windows, the trees, left pavilion fragment, right baskets, ground height, stone quay, stairs, entire water area and paper sky. Preserve original thin muted grey ink strokes, subdued old warm paper palette, drawing softness and detail. Do not zoom, crop, shift, add margins, add people, change the camera or repaint the whole scene. Especially preserve the outer 10 percent strips of all four image edges exactly for seamless insertion into the panorama. The repair should look like one architecturally plausible shop, with crisp separate roof tiles and cloth. Output ONLY the repaired painting.
```
