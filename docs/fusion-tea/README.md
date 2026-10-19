# 沿河茶市融合样板 · 保留原人物版

2026-10-09。本地入口：`http://localhost:8768/explore.html?study=tea`，或画卷右上角「茶摊新画法」。本次按用户要求仅本地完成，未发布、未部署。

## 当前版本

直接复用 `assets/explore/people-v2/tea.webp` 的全部 8 格原人物，包括用户截图的提壶茶博士。原图文件、衣纹、面部、茶壶和碗的纹理保持不变，没有让生成工具重画角色。

- 人物由原来的约 36–42 个局部画面像素，调整为 100–128 像素高的图格，再分别按姿态和家具校准；桌椅、门口和柜台作为比例参照。
- 每个人物使用图集内自己的真实脚底行定位，代替统一 92% 锚点；保留原图自带的凳子，给无凳的年轻坐客补了独立小凳。
- 老茶客水平转向茶桌；提壶人站在桌边，摊主和顾客的碗、手对齐；柜台前板遮挡摊主下身，棚沿作为独立前景层。
- 人物不使用调色滤镜或正片叠底，避免地砖纹理透进衣服。接触阴影独立于原人物文件。
- 背景改为较克制的淡彩与细墨线，并移除上一版所有新画人物和挡在摊前的大题签，为原人物留出合适的活动空间。
- 增加「茶桌近看」按钮。前后对比仍共享平移和缩放；采用 CSS zoom 保持放大时原人物图集细节。

## 素材

场景使用内置 image_gen 两次编辑：先移除上一版新人物并适配原图集的画风，再移除大题签补回地砖。最终场景 `assets/explore/fusion-tea/scene-original-style-v3.webp`，原稿 `art-source/fusion-tea/scene-original-style-v3.png`。实际尺寸 1484 × 1060；未假称原生 4K 或矢量无限清晰。

提示词：`original-characters-prompt.txt`、`scene-paving-prompt.txt`。人物配置及准确原素材路径见 `src/tea-study-actors.js`。

初版 `after.webp` 和原稿继续保留以便回看，当前修改后视图不再使用初版重绘人物。`before.webp` 仍是原画卷高分辨率背景和高清人物图集的真实浏览器截图。

## 范围与验证

这仍是茶市局部样板。主画卷、已有全部人物和 25 个寻物目标保留，未全图替换；样板不计寻物进度。

- 人物与收集相关 8 项测试通过。
- 构建与 215 个公开文件路径检查通过。
- 浏览器实查 8 个角色全部引用原 `people-v2/tea.webp`，filter 为 none、mix-blend-mode 为 normal。
- 桌面/390 × 844 手机验证对比滑杆、近看、退出、焦点返回及布局溢出；无页面脚本错误。
- 截图 `output/playwright/tea-original-v3-overview.png`、`tea-original-v3-detail.png`、`tea-original-v3-counter.png`、`tea-original-v3-compare.png`、`tea-original-v3-mobile.png`。

人物源图本身存在有限像素；场景在高倍率下仍会变软。本次重点是保住原人物细节并校准尺度、位置、家具关系和遮挡。
