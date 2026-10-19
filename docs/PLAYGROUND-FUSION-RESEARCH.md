# Search Playground 人物与场景融合研究

研究日期：2026-10-09。对照 Google 25 周年版本与当前本地 `explore.html`。本次是研究与诊断，没有修改运行时画面。

## 核心结论

清晰度和融合感是两个问题。Google 用分级图块维持放大清晰度；统一插画设计、比例、人物动作、投影和前后遮挡建立融合感。我们的缩放已经让背景和人物共用世界坐标，但独立素材的美术差异和缺少环境关系会随放大暴露。更换缩放算法或加一层阴影不能独立解决。

## 直接查证的参考站实现

- 官网 HTML 预加载 `/static/editions/twentyfifth/tiles/raster/1/00_00.png` 等概览图块。
- 公开脚本 `https://searchplayground.google/static/index.min.js?cachebust=aaf05b6` 中，图块地址函数按等级返回 PNG 或 SVG：25 周年版等级 1、2 对应 `tiles/raster`，其他等级对应 `tiles/vector`。当前配置等级范围为 1–3，绘制列表使用最低和最高等级。不能仅据地址函数声称每次缩放都依次请求所有等级。
- 该脚本按视口位置计算可见图块与外围缓冲范围；设备类型和像素比参与图块显示尺寸配置。
- 实查 `https://searchplayground.google/static/editions/twentyfifth/tiles/vector/3/02_03.svg`：画布为 1280 × 1440，含 2807 个 path、40 个 g、4 个 clipPath，没有 image 元素。这张抽样图块是矢量路径，不是将低清图片包在 SVG 容器中。
- 参与设计的 Caroline Choi 将该项目标注为 Vector illustration，展示了人物和建筑矢量素材。独立素材本身不是问题，素材最终是否遵守同一套美术规则才是问题。
- Oddfellows 项目页记录了与 Google Brand Studio 的合作、30 多位创作者和大量手绘人物。

以上不代表拿到了完整制作工程，也不据此声称整站全部内容都是单层静态 SVG。

## 画面对比与当前问题

1. **笔触与材质不一致。** 当前场景的屋瓦、树木、石板是粗轮廓、饱和色块，人物则偏细碎、灰褐、水墨感。人物与背景同时放大，差异依然存在。
2. **人物和家具的比例缺少统一标尺。** 应按所在局部的门、桌、座椅、栏杆校准，而不是以空地能否容纳人物为主要依据。不能统一放大所有人物，以免制造新的透视冲突。
3. **遮挡关系太少。** `src/explore-people.js` 的 `setupOcclusion()` 只有桥栏、两处茶棚，共三片粗多边形。人物按脚底 y 排序只解决人与人之间的部分前后关系，不能自动获得与树、墙、柜台、船舷的正确遮挡。
4. **脚底与阴影过于通用。** `styles/explore-people.css` 对全部人物用 `translate(-50%,-92%)`，统一椭圆渐变阴影；并未逐人读取实际足底和姿态。坐姿、挑担、双人组合需要各自的接地与投影设计。
5. **正片叠底不能代替融合。** 当前人物整体使用 `mix-blend-mode:multiply`。这会使人物颜色受到铺地颜色与纹理影响；它可以统一局部纸色，也可能造成衣服发灰、地纹透出般的观感。是否保留应通过局部对照决定。
6. **活动与环境没有充分关联。** 能站在路上不等于正在街市生活。买卖双方要围绕同一个摊位，坐姿人物要真正坐在椅面，扶栏者的手要与栏杆相接。现有空地筛查和防重叠规则不足以验收这些关系。
7. **背景高清化没有同步重做人物。** 当前已加载 5600 像素宽背景，世界宽仍为 2004；人物来自不同批次的独立栅格图集。素材分辨率、视角和细节语言需要一起检查。

## 建议的改造顺序

先制作一块沿河茶摊的完整样板：店面、桌椅、8–12 位人物及遮挡物作为同一个场景设计，校准俯视角、线宽、衣服色块、身体比例、动作和足底。静态人物可以与场景一起完成绘制或合成；保留独立的透明命中区域即可继续寻物。需要动的人物再拆成与该样板一致的局部图层。

在完整场景设计完成后输出低、中、高分辨率图块。水墨画不必强行转换成矢量，关键是各等级来自同一份审核过的母稿，不能分别生成导致人物、建筑或遮挡改变。分块仅解决加载和清晰度，并不自动修复美术。

验收先看全图、常用近景、最大倍率的同一区域，检查脚是否贴地、桌椅比例、前后遮挡、衣服有无地纹穿透、人物是否在做与身边物体相关的事。通过后再推广到八区。现有人数和寻物交互测试只能证明功能，不证明融合质量。

## 证据与来源

- 参考站：https://searchplayground.google/
- 制作团队：https://oddfellows.tv/work/the-playgrounds
- 参与设计师：https://carolinechoi.squarespace.com/googleplayground
- Google 官方介绍：https://blog.google/products-and-platforms/products/search/google-trends-most-searched-playground-doodle/
- 当前浏览器截图：`output/playwright/fusion-current-tea.png`。
- 参考站浏览器截图：`output/playwright/google-reference-overview.png`、`output/playwright/google-reference-detail.png`。
- 当前实现：`src/explore-people.js`、`styles/explore-people.css`、`src/explore-population.js`。
