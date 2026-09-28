# 季节场景

中秋街道暂时关闭。`index.html` 的 `<body>` 上 `data-midautumn-enabled="false"` 控制入口；改为 `true`、构建并发布后恢复。

运行时相关文件位于 `src/festival-street.js`、`src/festival-lighting.js`、`src/midautumn.js`、`styles/midautumn.css` 和 `assets/midautumn/`。
资源白名单保留该场景所需素材，不因当前入口关闭而删除。

原始候选图保留在 `art-source/images/midautumn/`，制作记录在 `docs/prompts/midautumn/`，均不进入网站发布包。
首页烟花与中秋入口开关独立。
