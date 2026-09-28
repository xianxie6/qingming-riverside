# 孙羊正店店堂插画

生成方式：内置 image_gen。参考 `assets/qingming-panorama-v1.webp` 的细线淡彩风格，生成新的店堂场景。

成品：`art-source/images/sunyang-interior-v1.webp`。原始 PNG 保留在 Codex generated_images 中，项目使用 WebP 版本。

提示词：

Create a NEW project illustration, reference image is STYLE ONLY. Historical-scene asset for an interactive Qingming riverside scroll: the inside of Sunyang restaurant in Song dynasty Kaifeng. Wide landscape 3:2 composition. Extremely fine restrained ink outlines and delicate muted mineral watercolor on aged warm ochre silk paper, EXACT same aesthetic as reference, not photorealistic, not 3D or vector. Open front cutaway architectural view, slightly elevated traditional Chinese scroll perspective, detailed timber posts, tiled roof along top edge, folding lattice windows, timber tables, benches, porcelain dishes, earthenware wine jars, hanging cloth doorway curtain. Compose a coherent busy restaurant: far LEFT 15% a doorway from the riverside street, with welcoming attendant; LEFT-CENTER at 33% width 65% height an empty square window-side table with two stools and view through open windows onto distant river willow and bridge; CENTER at 55% width 72% height a second empty square hall table with benches; RIGHT 82% width 50% height long preparation counter with stacked bowls, jars and a cook behind it, a steaming stove at far right. A few small delicate period diners in back and one server carrying tray. Keep both foreground visitor tables clear of food, one tea vessel only, so website can place food there later. Architectural space fills entire frame, no large empty sky. Subtle ink texture and rich tiny naturalistic details, quiet warm daylight. NO overlaid typography, NO labels, NO UI, NO arrows, NO watermark. Blank shop plaque if present. Save as a wide high resolution image.

店堂位置、人物对白、食材来路及内部布局均为创作推演。

## 第二版：与动态街市统一

使用内置 image_gen 编辑第一版店堂，参考实际街市 `assets/street-empty.webp`，降低褐色木纹密度及暗部对比，改为更淡的灰绿线条和柔和设色。成品为 `art-source/images/sunyang-interior-v2.webp`，旧版保留。

窗外大窗与后排开窗由网页 SVG 裁切直接引用 `assets/street-empty.webp`，复用动态街市的木桥、河岸和临河建筑；不是独立生成的桥景。裁切跟随店堂图片的 object-fit:cover 坐标，桌席热点不变。窗景目前为静态底图，不同步室外人物、天气和船只动画。

第二版最终提示词：

Edit image 1 (restaurant interior) using image 2 (actual exterior street) as the style and palette reference. Preserve EXACT image 1 canvas dimensions, camera, architectural silhouette, window openings, door positions, tables and ALL furniture/character positions: interactive coordinates already depend on them. Refine only rendering style: less dense scratchy wood grain, lighter washed warm parchment, finer softer gray-olive ink contours, flatter traditional Chinese scroll space. Match exterior's restrained dusty sage, muted teal, pale blue, rose, ochre and ivory clothing colors rather than brown monochrome. People should have the same delicate thin outline and modest flat color fills as figures in a Qingming scroll. Keep tables clear. Reduce heavy contrast and gritty antique sepia texture. IMPORTANT windows and doorway: replace invented far-away pagoda and tall stone arch bridge with the low gently arched timber footbridge with timber rails and stone riverside embankment from image 2, same actual roof shapes and trees. Main left-center window clear opening rectangle approximately x392..566,y239..521 in 1536x1024 source; keep frame boundaries pixel aligned. Preserve back window openings too. No new towers, no grand bridge arch. This is the same small riverside tea market as image 2. No text, no UI. Keep composition and dimensions 1536x1024 unchanged.

## 高清画师

内置 image_gen 根据用户提供的原画师截图生成三姿态透明人物图集 `assets/painter-hd-v1.webp`。站立、行走、落座均保留朱衣、蓝绿裤装、幞头和竹编画卷包。网页使用同一套腿脚变形渲染行走，并将对话气泡定位到说话人。

最终提示词：

Use attached reference as exact character identity. Create a high-resolution delicate traditional Chinese fine ink outline and muted mineral watercolor game character sprite sheet on TRUE transparent background. Same slender adult male Song dynasty painter, exact black folded headcloth, red vermilion knee-length robe with ivory edging, dark blue-green loose calf trousers, cream patterned leg wraps, black cloth shoes and bamboo woven backpack with scrolls sticking up. Same side profile facing RIGHT, same face and proportions. Not anime, not 3D, no modern styling. Preserve antique Qingming scroll aesthetic but crisp detailed elegant linework. Sprite sheet exactly 3 equally spaced columns and 1 row, 1536x1024 canvas: LEFT column full standing relaxed pose feet close, CENTER column full mid-step walking pose one leg forward with connected natural knees/ankles, RIGHT column seated side profile on an INVISIBLE stool knees bent 90 degrees both feet on ground, hands near lap, backpack stays attached. Each full figure fits its own 512px column with generous transparent margins. Head same y coordinate in standing/walking, soles same baseline y=930, seated figure shorter but feet same baseline. No chairs, no shadows, no background, no text. Only these three versions of exactly same person. Detailed fabric ink folds and fine woven pack, matching original color. Transparent alpha required.

## 第三版：独立迎客伙计与清晰动画

2026-09-21：用内置 image_gen 从第二版店堂中提取同一名迎客伙计，保存为真正透明的 `art-source/images/sunyang-host-v1.webp`；移除底图中该人物，保存 `assets/sunyang-interior-clean-v3.webp`。原资产保留。运行时仅对透明人物做抬掌与轻点头的连续变形，门框不参与。画师中间动画画布采样密度提高到 12，显示画布支持高像素密度，停步使用完整站姿。行进按距离驱动步态，并增加自由手与头部的细微运动。

伙计最终提示词：
Extract ONLY the welcoming waiter standing at far left doorway in the reference (source coordinates approximately x110 to250 y480 to782 in1536x1024). Produce one high-resolution full-body transparent PNG cutout, actual alpha background, no shadow/background/floor/door/other people. Exactly preserve his identity, blue-gray crossed robe, ivory apron, dark soft cap, black shoes, Chinese Song handscroll delicate dark ink contours, muted watercolor colors and original proportions. His leftward extended hand palm up welcoming, other hand at waist. Complete feet, hat and fingers. Enlarge cleanly to roughly 850 pixels tall centered on 1024x1024 transparent canvas; keep original pose and silhouette. Fine crisp details, no blurry edges, no photorealism, no white halo.

底图最终提示词：
Edit this reference with one tiny local change only: REMOVE the blue gray robed welcoming waiter with ivory apron and black cap standing in the LEFT doorway (source bbox x110..250 y480..782 on1536x1024). Inpaint the previously occluded door jamb, threshold, wicker basket and quiet exterior path consistently. Remove all parts of that ONE waiter including extended left arm, shoes and hat. Keep EVERY OTHER person, architecture, plant, window, object, perspective, ink line and color in exactly original pixel positions. Output same1536x1024 composition. No new people. This is a clean background plate for animation of that waiter separately.

气泡依照用户最新漫画参考：近白底、细黑轮廓、竖排粗楷体、指向人物的尖尾，短句分列。替代此前的宋式纹样方向；不将漫画参考的“哈哈哈”机械套到所有剧情中。

## 第四版：换手引席、小毛笔对白

伙计仍用同一身份与服饰，改为画面右侧的另一只手朝店内摊掌，原来左伸的手收在腰间。透明素材为 `assets/sunyang-host-v2.webp`，网页的动作网格改为控制新伸出的手臂。横排对白使用 Ma Shan Zheng 毛笔字体，随项目附带 OFL 许可，字体来源：https://github.com/googlefonts/mashanzheng 。

换手最终提示词：
Edit this same full body Song dynasty waiter transparent sprite. Preserve exact identity, face looking slightly left, blue gray robe, ivory apron, black soft cap, proportions, delicate ink and muted watercolor. CHANGE ONLY ARMS: the currently extended arm reaching toward image LEFT should rest naturally at his waist. The OTHER arm, currently hidden on image RIGHT, should extend welcoming toward image RIGHT, elbow gently bent, palm open upward, inviting a customer into the room to the right. Exactly two arms and two hands. Do NOT mirror the whole person; keep face, hat and robe wrap same orientation. Full feet included, crisp high resolution, same modest ink outline style. Single full body figure centered on TRUE transparent background alpha, no props, no floor or shadow, no colored halos. 1024x1536 portrait canvas.
