# 招船场景：空甲板素材

- 方式：内置 image_gen 图片编辑，透明背景。
- 输入：`assets/boat.webp`。
- 输出：`assets/boat-passenger-clear.webp`，2172 × 724，保留透明通道。
- 用途：仅用于可乘坐的渡船；原货船素材继续用于背景船只。
- 主人公站位：船体局部坐标 `(48, -10)`，随船体缩放和方向变换。

## 生成提示词

Use case: precise-object-edit. Edit target: supplied transparent game sprite of a Chinese Song dynasty wooden covered boat. Remove ONLY all three cloth sacks, the bamboo basket, and the coil of rope on the RIGHT open deck, leaving that entire deck empty and standing room for a passenger. Reconstruct the planked wooden deck and far gunwale that were behind these objects in the same detailed muted antique Chinese ink-painting style. Preserve exactly the boat outline, bow and stern, central bamboo canopy, left empty deck, hull, proportions, perspective, framing, original aged sepia textures and colors. No people, no new objects, no water, no shadows outside hull, no background. Transparent alpha background. Keep full boat in precisely the same location and scale relative to canvas as the source, preferably original 2172 by 724 canvas. This is a replacement sprite for a game; composition alignment matters.
