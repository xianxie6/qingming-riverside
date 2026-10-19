# 横立面四季素材

使用内置 image_gen 编辑，未使用 CLI/API。项目最终素材保存于 `assets/seasons/`。春季复用现有原景与人物。

## 背景（分别编辑三段；不使用拼图草稿）

输入：`assets/district-west-fast.webp`、`assets/street-empty.webp`、`assets/district-east-fast.webp`。每次只传一张，分别生成 `{summer,autumn,winter}-{west,center,east}.png`。

共同提示词：

> Precise localized seasonal edit of this SINGLE supplied panorama. Return ONE SINGLE full panoramic scene, same 2172x724 pixel 3:1 aspect ratio as input, not a collage, no panels or dividers. CRITICAL registration for game assets: preserve EXACT input framing, camera, image boundaries, proportions and x/y locations of all buildings, rooflines, windows, stalls, foreground furniture, bridge deck and opening, waterwheel, tree trunks, paths, stone river wall and posts. Do NOT crop sky or river. River must occupy same bottom approx 28 percent as input; walkable lane must stay at same y coordinates. The fine ink linework, ancient Song dynasty Chinese scroll drawing style and texture must be maintained. Change vegetation and season-specific surfaces only; no moved, redesigned, added or missing architecture. No people, boats, animals, text or logos. Keep full-width scene and all background empty sky and foreground river in frame.

季节分别追加：

- Summer: Densely leafed dark jade-green trees and fresh green willow fronds, naturally brighter clear summer daylight; water muted blue-green. Wood and stone retain brown and gray material colors.
- Autumn: Trees have ochre yellow, russet, muted amber foliage with sparse green remnants; a few natural fallen leaves by street edges, crisp clear daylight; neutral flowing water. Do not give roofs an orange wash.
- Winter: Replace leafy deciduous crowns with intricate mostly bare fine branches in EXACT same trunk positions; irregular fresh white snow rests on upward-facing tiled roof surfaces, awnings, parapets and branches, thin snow at edges of a scuffed pedestrian path; pale winter daylight, slate gray OPEN flowing river. No ice across river; boats and mill must still work. Do NOT bake falling snow into the picture.

## 画师与船夫服饰

输入：`assets/featured-characters-v7.webp`。分别生成 `featured-{summer,autumn,winter}.png`。

共同约束：Precise clothing-only edit of this two-character Song Dynasty game sprite sheet. Keep EXACT original 1536x1024 framing, plain white background, the two men in EXACT SAME locations, poses, sizes, facial identities, every hand grip point, feet and sole contact points, facing direction, carried scroll case and hats. No moved anatomy, added props or background. Preserve fine ink linework and handpainted historical watercolor texture. Keep outlines as close to original as possible for shared mesh animation. Only seasonal clothing changes; no text, logos, snow or environment.

- Summer: Left scholar wears an unlined light flax/ivory cross-collar shirt with light sage waist sash and lighter loose slate cloth trousers; lightweight drape without thick padding, same long sleeve contours. Right boatman wears breathable pale hemp shirt, rolled cuffs and short working trousers with exposed shins as in source, same straw hat and sandals. No wool collar, coat or cape.
- Autumn: Scholar wears a muted russet lined cross-collar right-fastening jacket with clearly drawn lapels and cuffs, dark loose trousers, no shoulder wrap or cape. Boatman wears an ochre lined long-sleeved jacket extended to wrists, with hands at exactly original grip positions, full-length dark cloth trousers and enclosed cloth shoes; thin warm layers, no thick snow fur. Both look ready for cool autumn air. 当前接入 `featured-autumn-v2.png`；居民完整图集与画师修正提示词见 [宋式秋装](song-autumn-wardrobe.md)。
- Winter: Left scholar wears a thick muted burgundy padded cross-collar long jacket, short dark wool shoulder cape with cream shearling collar, quilted darker trousers, cloth closed shoes and warm ankle wraps. Right working boatman wears thick ochre quilted long-sleeved jacket, wool collar, sleeves extending to wrists but EXACT same two hands left exposed at their original grip locations; full dark cloth trousers extending to ankles, warm ankle wraps and closed dark cloth shoes exactly within existing feet outlines (no bare shins, forearms or sandals). Preserve ink lines and fine historical Chinese hand-painted texture; no modern clothing, no new objects, no snow, no environment, no text. Maintain exact original figure silhouettes as much as possible for shared animation rig. Full figures intact; white background.
