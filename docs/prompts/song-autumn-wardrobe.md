# 宋式秋装修正（2026-10-10）

使用 Codex 内置 image_gen 编辑，未使用 CLI/API。

- 居民：`assets/people-ink.webp` → `assets/seasons/people-autumn-v1.png`，1536 × 1024，12 人图集沿用原始位置、动作和裁切。
- 画师与船夫：`assets/seasons/featured-autumn.png` → `assets/seasons/featured-autumn-v2.png`，去掉画师短披肩，露出完整夹袍领襟；船夫保留长袖与长裤。
- 秋季与冬季共用完整服装图集加载和轮廓提取；全套资源成功后才切换。完整秋装纹理不再经过原衣服的颜色蒙版、灰色披肩或皮肤恢复步骤。秋雨沿用完整秋装与现有撑伞动作。
- 秋装为场景美术重绘：男子交领右衽夹袍、女子褙子长裙、劳作者与孩童夹短衣裤装。保留清晰袖口、衣襟、腰带和自然衣褶。

形制参考：[中国丝绸博物馆「素罗背子」](https://chinasilkmuseum.com/zggd/info_21.aspx?itemid=1830)、[南宋褙子与围裹式两片裙裁剪复原](https://www.chinasilkmuseum.com/ngcxg/info_11.aspx?itemid=31129)。场景配色和秋季厚薄属于美术设计。

验证：171 项 Node 测试通过；最终服饰相关 18 项测试通过；发布构建与 234 个公开文件引用检查通过。浏览器检查春→冬→秋切换、放大、行走、秋雨撑伞；刷新后的页面没有控制台错误。截图位于 `output/playwright/autumn-song-clothes-detail.png` 与 `output/playwright/autumn-song-clothes-rain.png`。

## 居民完整提示词

```text
Use case: identity-preserve
Asset type: exact registered 1536 x 1024 game character sprite atlas, two rows of six figures.
Input image is the EDIT TARGET. Edit only their clothing into credible Song dynasty civilian AUTUMN clothes. Maintain EXACT atlas layout, scale, positions and silhouette, same 12 people, faces, hair, hands, foot positions, gestures, bowls, tea kettle, serving tray, shoulder carrying pole and baskets. This is a technical sprite atlas used with existing fixed crop rectangles and joint coordinates, so registration is critical; never recompose or move people.
Replace clothing with softly lined autumn garments drawn as complete clothes: men in crossed-collar right-fastening lined robes, cloth waist ties, visible natural cloth folds and sleeve seams; women in Song-style long straight-collar front-opening beizi over skirt and inner crossed collar; laborers and child in lined short crossed-collar jackets with trousers reaching ankle and cloth shoes. Preserve the originals' overall silhouette and poses, especially hands and feet. No winter fur. Muted moss green, slate blue, soft ochre, brown and beige seasonal colors with varied clothes. Clearly readable collars, lapels, cuffs, waist ties and layered hems. No shoulder shawls, no capes, no ponchos, no flat triangular bibs covering the chest, no mystery overlays. Keep the fine ink outlines and subtle aged watercolor wash of original. Pure white background as original for existing paper-removal pipeline; no shadows on background. No labels or lettering. Return exact 1536 x 1024 dimensions.
```

## 画师完整提示词

```text
Use case: precise-object-edit. Edit target: the provided two-character 1536 x 1024 Song dynasty autumn sprite atlas. ONLY correct the LEFT scholar's autumn clothing: REMOVE the brown shoulder cape completely and replace that exact shoulder/chest region with the matching russet red lined crossed-collar right-fastening robe fabric, with clear pale inner collar, lapels, natural ink folds continuous into existing sleeves and waist. Keep his original shoulder silhouette and backpack straps, the scroll backpack and hat. Autumn lining is subtle, no fur, no shawl, cape, poncho, triangular chest overlay. Preserve exact face, body, position, scale, walking pose, hands, feet, all grip points and original lower robe, waist belt and trousers. RIGHT BOATMAN stays pixel-identical, already appropriate long-sleeved autumn jacket and trousers. Keep fine ink and watercolor texture, pure white background and exact 1536 x 1024 atlas layout. Do not move, rescale or recenter either figure. No text.
```

