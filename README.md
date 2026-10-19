# 清明上河

可交互的宋代沿河街市画卷。沿河行走、饮茶、乘船，在夜景与时雨中游览街市，或参与虹桥过船并留下画稿。

**[在线体验](https://xianxie6.github.io/qingming-riverside/)** · [Vercel](https://qingming-riverside-nine.vercel.app/) · [Cloudflare](https://qingming-riverside.zhangxianxie6.workers.dev/) · [作者 X](https://x.com/Xian0063)

无需安装或登录，支持电脑与手机浏览器。插画为生成与编辑后的再创作，不是《清明上河图》原画扫描。

| 沿河灯火 | 城门货市 |
|---|---|
| ![夜景](docs/showcase/night-riverside.webp) | ![城门](docs/showcase/night-city-gate.webp) |
| ![水磨](docs/showcase/watermill-day.webp) | ![时雨](docs/showcase/rain-market.webp) |

## 本地运行

需要 Python 3；开发、测试和构建使用 Node.js 22 或更新版本。

```sh
python3 scripts/preview.py
```

macOS 也可双击 `打开清明上河.command`。不要直接以 `file://` 打开 HTML：浏览器会限制模块与画布资源读取。

```sh
npm ci
npm test
npm run build
npm run check
```

- `npm test`：运行全部测试，当前数量以执行结果为准。
- `npm run build`：生成仅含穿越及后续可行走街市的 `dist/` 发布包，验证页面、模块、样式和素材引用。
- `npm run build:all`：构建全部本地试验模块，供本地检查；不用于当前公开发布。
- `npm run check`：构建并校验 Cloudflare 配置，不发布。
- `npm run dev`：构建后启动 Wrangler 本地服务；修改源文件后需重新构建。

## 项目结构

```text
index.html / sunyang.html  页面入口
src/                      前端逻辑
styles/                   样式
assets/                   网站使用的图片、音频、字体
art-source/               原稿与历史候选，不进入网站发布包
tests/                    自动化测试
scripts/                  构建、预览、资源白名单和检查工具
docs/                     操作、实现、验证与制作记录
vendor/                   本地第三方库及其许可证
migrations/               Cloudflare D1 数据库迁移
worker.js                 访问计数 API
```

新增运行时素材时，同步更新 `scripts/public-assets.json` 和 [素材清单](docs/ASSET-INVENTORY.md)。X 长文与宣传图保存在项目之外，不纳入仓库。

## 发布

三种部署均以 `dist/` 为网站内容。不要直接发布仓库根目录，避免把原稿和开发文档一并发布。

当前公开范围仅为「穿越」的完整旅程与其进入的四季街市。时空镜、古城烟火、纸上汴京、中秋灯市及独立餐馆页的入口、代码和素材均不进入默认发布包；本地直接运行源码时继续保留。发布清单和构建期裁剪见 `scripts/crossing-release.mjs`。

- **GitHub Pages**：仓库 Settings → Pages → Source 设为 **GitHub Actions**。工作流对 PR 执行测试与构建，`master` 分支检查通过后发布 `dist/`。这是从原来的分支根目录发布方式迁移所需的一次性设置。
- **Vercel**：`vercel.json` 已配置构建命令与 `dist/` 输出目录；访问计数转发到 Cloudflare。
- **Cloudflare**：`npm run deploy`。首次部署到自己的账号，需要在 `wrangler.jsonc` 配置自己的 D1 数据库，并执行迁移。仓库中的数据库标识不是访问密钥，也不能替代账号授权。

只发布已验证静态包到 GitHub Pages：`npm run deploy:pages`。脚本将 `dist/` 和发布工作流保存到环境允许的 `gh-pages` 分支，触发现有工作流在该分支上传 Pages artifact；主分支源码与 Pages 的 workflow 配置保持原状。该命令需要现有 Git 和 GitHub CLI 身份。

验证发布包可运行 `python3 -m http.server 8765 --directory dist`，然后打开本机地址。

## 文档与许可

- [纸上汴京：分层剪纸剧场](docs/PAPER-THEATRE.md)
- [时空镜：宋代与今日](docs/TIME-LENS.md)
- [操作说明](docs/CONTROLS.md) · [实现说明](docs/ARCHITECTURE.md) · [项目缘起](docs/PROJECT-STORY.md)
- [更新与历史验证记录](CHANGELOG.md) · [发布检查](docs/QA-2026-09-24.md)
- [素材清单与待确认授权](docs/ASSET-INVENTORY.md) · [插画制作记录](docs/prompts/ASSETS.md)

本项目目前公开供展示和查阅，未额外授予代码与项目素材的复用或商业使用许可。第三方库与字体遵循各自许可证，详见 [LICENSE](LICENSE)。复用与商业合作请通过 [X](https://x.com/Xian0063) 联系维护者。

中秋街道暂时关闭，代码和素材继续保留；恢复方法见 [季节场景说明](docs/SEASONAL-SCENES.md)。

## 古城烟火

首页「古城烟火」入口打开 `explore.html`。V3.1 在八区 320 位人物画卷上增加 25 个人物与群像目标，支持渐进提示、原位放大、收藏册和本地续存；人物间距已重新调整，并补绘 254 个图块以取消人物素材复用，按可站立地面重新落位，见 [人物去重修正](docs/PEOPLE-V3-REWORK.md)。实现、验证和素材限制见 [V3.1 说明](docs/EXPLORE-V3.1.md)。旧寻物版保留在源码 `explore-game.html`，不随当前构建发布。

2026-10-08 新增 128 位结伴游人，总人数 448；调整人物色调、接触阴影与局部比例，并加入水纹和茶摊热气。25 个寻找目标保留，见 [游人与场景融合](docs/VISITORS.md)。

2026-10-09「古城烟火」八区接入保留原人物的融合调整：全图淡彩、按有效人物轮廓和姿态统一尺度、真实脚底与接触阴影、建筑/桥栏/水域/船篷禁区，以及前景深度遮挡，448 人和 25 个寻找目标保留。当前仅本地版本，见 [全图融合说明](docs/CITY-FUSION.md)。
