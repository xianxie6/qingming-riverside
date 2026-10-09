# 清明上河

可交互的宋代沿河街市画卷。沿河行走、饮茶、乘船，在夜景与时雨中游览街市，或参与虹桥过船并留下画稿。

**[在线体验](https://xianxie6.github.io/qingming-riverside/)** · [Vercel](https://qingming-riverside-nine.vercel.app/) · [Cloudflare](https://qingming-riverside.zhangxianxie6.workers.dev/) · [作者 X](https://x.com/Xian0063)

无需安装或登录，支持电脑与手机浏览器。插画为生成与编辑后的再创作，不是《清明上河图》原画扫描。

| 沿河灯火 | 城门货市 |
|---|---|
| ![夜景](docs/showcase/night-riverside.webp) | ![城门](docs/showcase/night-city-gate.webp) |
| ![水磨](docs/showcase/watermill-day.webp) | ![时雨](docs/showcase/rain-market.webp) |

## 穿越

首页点击「穿越」，滚动或拖动推进木桥搭建、划船与宋人相逢。可暂停、拖动进度或返回长卷；点击「随他游街」或「直接入画」进入虹桥街市。河水复用项目现有纹理与波动着色，减少动态效果设置下直接进入街市。

穿越时默认循环播放背景音乐，顶部可关闭或重新开启；退出穿越后停止播放。

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
- `npm run build`：生成 `dist/`，验证页面、模块、样式和素材引用。
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

- **GitHub Pages**：仓库 Settings → Pages → Source 设为 **GitHub Actions**。工作流对 PR 执行测试与构建，`master` 分支检查通过后发布 `dist/`。这是从原来的分支根目录发布方式迁移所需的一次性设置。
- **Vercel**：`vercel.json` 已配置构建命令与 `dist/` 输出目录；访问计数转发到 Cloudflare。
- **Cloudflare**：`npm run deploy`。首次部署到自己的账号，需要在 `wrangler.jsonc` 配置自己的 D1 数据库，并执行迁移。仓库中的数据库标识不是访问密钥，也不能替代账号授权。

验证发布包可运行 `python3 -m http.server 8765 --directory dist`，然后打开本机地址。

## 文档与许可

- [操作说明](docs/CONTROLS.md) · [实现说明](docs/ARCHITECTURE.md) · [项目缘起](docs/PROJECT-STORY.md)
- [更新与历史验证记录](CHANGELOG.md) · [发布检查](docs/QA-2026-09-24.md)
- [素材清单与待确认授权](docs/ASSET-INVENTORY.md) · [插画制作记录](docs/prompts/ASSETS.md)

本项目目前公开供展示和查阅，未额外授予代码与项目素材的复用或商业使用许可。第三方库与字体遵循各自许可证，详见 [LICENSE](LICENSE)。复用与商业合作请通过 [X](https://x.com/Xian0063) 联系维护者。

中秋街道暂时关闭，代码和素材继续保留；恢复方法见 [季节场景说明](docs/SEASONAL-SCENES.md)。
