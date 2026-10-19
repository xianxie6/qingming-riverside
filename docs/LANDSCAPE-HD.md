# 古城景观高清重绘 · 2026-10-08

- 输入：`assets/explore/people-v3/background.webp`，2004 × 785。
- 方法：内置 imagegen；原图按 4 列 × 2 行裁成参考块，逐块重绘屋瓦、木纹、树叶、石板、竹篷、水纹。未采用整图插值放大充当细节。
- 重绘原稿：`art-source/landscape-hd/tiles/0-0.png` 至 `3-1.png`，约 1417 × 1110 / 块。
- 发布：`assets/explore/people-v3/background-hd.webp`，5600 × 2194，约 5.8 MiB。共约 1229 万像素，是原稿的 7.8 倍。
- 打包：`node scripts/build-landscape-hd.cjs`；创作打包需 sharp（本机 0.35.4），普通网站构建直接复制成品，不需要 sharp。初版曾在边界混入低清原图，导致大倍率下出现模糊带；现已删除该混合。当前全部底图由不透明高清块覆盖，另用 7 条 imagegen 局部重绘条带修复接缝，过渡只发生在高清素材之间。
- 世界坐标仍为 2004 × 785；人物大小、寻物坐标、命中检测不随素材分辨率改变。
- 背景先显示旧版概览，高清文件下载并解码后替换；三处前景遮挡同步使用同一高清图。失败保留概览，下一次放大可重试。
- 最大世界缩放由 2 提高至 4；界面倍率为世界缩放除以全图适配倍率，随窗口尺寸变化。
- 限制：生成细节为重绘，局部轮廓可能与旧稿略有差异；栅格素材仍有有限分辨率，超过原生密度仍会逐渐变软。

## 每块使用的提示词

Restore this cropped map tile with exquisitely sharp detailed ink drawing: individually delineated roof tiles, timber grain, fine leaves and branches inside tree silhouettes, woven bamboo, wood planks, fine stone surface texture. Preserve EXACT composition, colors, lighting, every contour, object location, original text and clipped objects on edges. It is one tile of a continuous larger painting: ALL FOUR EDGES must match reference exactly; no border, no reframing, no moving or adding objects, no new shadows. No people. Only enhance fine internal material detail and clarity. Keep original Song dynasty map watercolor style. Output same 1503 pixel width and original aspect ratio. Every large shape must retain its current outline so this image registers precisely on its source.

## 验证

- 网站构建及发布路径检查通过。
- 人物布局和寻物交互相关 8 项测试通过。
- 浏览器确认实际加载宽 5600 像素图片，前景遮挡使用相同资源；茶市 3.8× 页面截图见 `output/landscape-hd-browser.png`。
- 浏览器最大倍率验证：1280 × 720 窗口为 6.3×，世界缩放达到 4。
- 人为拦截高清资源后仍可浏览旧图；解除拦截并点击放大，成功恢复高清层。测试中的一次资源错误来自该主动拦截。

## 接缝修复 · seams3

- 用户在 933 × 881 窗口、6.5× 倍率指出河岸模糊带；定位为初版 20 像素低清边缘混合。
- 移除低清底图混合，并重绘 3 条纵向、4 段横向接缝。输入、原稿和坐标保存在 `art-source/landscape-hd/seams/`。
- `src/explore-people.js` 与高清图片 URL 加入 `20261008-seams3` 版本，避免旧图缓存。
- 浏览器实测截图：`output/landscape-seams3-browser.png`。这次修正消除接缝带的低清来源；栅格图的原生分辨率限制仍然存在。
