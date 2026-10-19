# 有限动画试点 · 生图与安装

2026-10-16。单张原画网格变形会显得像橡皮人，试点改用少量手绘关键帧：每位人物 3 帧（干活）或 5 帧（1 站立 + 4 走路），按「定格 → 动作 → 定格」的节奏切换。帧图未安装前，画面继续使用原图，不影响现有效果。

## 试点人物

| 人物 | 位置 | 帧 | 提示词 |
| --- | --- | --- | --- |
| `fields-02` 弯腰除草的女农人 | 田畴 | 3：俯身 → 拔草 → 起身甩草 | `fields-02-weed-v1.json` |
| `fields-04` 扛锄人，改为锄地 | 田畴水渠边田埂 | 3：扶锄 → 举锄 → 落锄 | `fields-04-hoe-v1.json` |
| `fields-01` 俯身收割的农人 | 田畴 | 3：拢穗 → 拉镰 → 收束 | `fields-01-harvest-v1.json` |
| `temple-04` 持帚扫地的僧人 | 菜园（默认视角） | 3：扶帚 → 扫 → 收帚 | `temple-04-sweep-v1.json` |
| `bridge-23` 背囊远行客 | 菜园（默认视角） | 5：站立 + 四帧走路，朝右 | `bridge-23-walk-v1.json` |

提示词、参考图都在 `art-source/street-extension/limited-animation/`。参考图 `<id>-reference.png` 是从原图集裁出的透明人物。田间人物是高角度俯视，生图须保持同一视角。

## 步骤

1. 在 Codex 里用内置 `image_gen`，按 JSON 中的 `prompt`（含参考图路径、透明背景）生成。
2. 原图存为 JSON 里 `save_as` 的路径，例如 `art-source/street-extension/limited-animation/fields-02-weed-v1.png`。要求：**单行等宽格子**，格数与 `cells` 一致，透明背景，人物不碰格边。
3. 运行 JSON 里的 `install` 命令，例如：

   ```sh
   node scripts/install-limited-animation.mjs art-source/street-extension/limited-animation/fields-02-weed-v1.png
   ```

   脚本会检查透明背景、格数、空格、人物是否碰到格边、各格身高差（干活 ≤35%，走路 ≤12%）。不合格会列出原因并拒绝安装。合格则转为 `assets/extension-preview/limited/<file>.webp`，登记到同目录 `manifest.json`，并输出对齐预览 `output/limited-animation/<file>-aligned.png`。
4. 标定脚的位置：生成图里各格人物常有整体漂移，下垂的杂草、工具又会被误认成脚底，所以每张图要在 `src/extension-limited-animation.js` 的配置里写 `soles`（每格前脚鞋底的格内像素坐标），然后重新安装。对齐预览里的红线是共用的鞋底线，各格前脚都应落在线上。
5. 刷新 `extension-preview.html`，人物即换成关键帧。帧图入卷时与原人物一样降饱和度（`saturate(.78)`）。

## 进度

- `fields-02` 除草女农人：已生成并安装（2026-10-16）。第 3 格整体偏左约 45、偏下约 50 像素，已按鞋底标定修正。页面中三姿势循环正常，脚不移位。
- 2026-10-17：其余 4 位已生成并安装，5 位试点全部完成。
  - `fields-04` 锄地人：第 2、3 格横向漂移 -40、+28 像素，按两只草鞋中点标定。生成图比原图更偏正面，但戴斗笠的俯视效果在画中不突兀。
  - `fields-01` 收割人：视角与原图最一致，各格仅漂移约 8 像素。
  - `temple-04` 扫地僧人：被扫帚挡住的鞋各格不同，用袍身逐像素比对求偏移，再以右鞋标定。
  - `bridge-23` 背囊行人：按头部自动对齐，无需标鞋底。画中一步约半个身高，所以配置 `cycle: .95`（每 0.95 身高走完四帧），速度 `pace: .5`（每秒半个身高），脚不打滑。第 2、4 格和第 3、5 格几乎相同，侧面看左右腿分不出，循环仍自然。
  - 页面实录：`output/limited-animation/fields-pilot-preview.gif`、`garden-pilot-preview.gif`。
- 2026-10-17 第二批（待生成）：仓场吊车旁的 `mill-16` 倾袋卸粮工人、`mill-14` 验粮农妇；默认视角的 `bridge-17` 糕饼贩、`fields-13` 修农具村妇、`bridge-20` 拄杖长者（小步慢走，`cycle .7`、`pace .3`）、`bridge-24` 抱箱行人。走路帧一律朝右画。行人的 `pace` 现在就生效，所以未生成帧图前他们也已按新速度走。生成后逐张标 `soles`，并按实际步幅校准 `cycle`。
- 2026-10-17 第二批已生成并安装，共 11 位使用关键帧。
  - `mill-16`、`mill-14`、`bridge-17`：各格依次向左漂约 44–52 像素（生成时格宽与切分不一致），按腿部、粮筐、裙摆比对求偏移后标定。
  - `fields-13`：v1 前两格铁刃单独放在地上、第 3 格却装在杆头，循环时刃会跳。已用 `fields-13-tools-v2.json` 重新生成，三格里刃都绑在杆头上，三个动作（端详 → 缠绳 → 举起看刃）全部播放。v2 的鞋底标定由 Codex 安装时写入，与篮子比对的偏移相差不到 6 像素。实录：`output/limited-animation/fields-13-tools-preview.gif`。
  - 安装脚本对已手动标定的人物会输出 NOTE，提醒新生成的图需要重新标定。
  - `bridge-20` 拄杖长者：一步约 0.39 身高，`cycle .8`；`bridge-24` 抱箱人：一步约 0.41 身高，`cycle .85`、`pace .45`。
  - 页面实录：`output/limited-animation/warehouse-batch2-preview.gif`、`garden-batch2-preview.gif`。
- 2026-10-17 第三批：田畴路上 6 位行人 `fields-07`、`fields-15`、`fields-12`、`fields-08`、`visitors-02`、`visitors-04`，共 17 位使用关键帧。
  - 原图是背影或俯视，在路上横着走很诡异。提示词附两张参考图：第一张定人物，第二张（`bridge-23-walk-v1.png`）只定平视侧面视角和 5 格布局。生成结果都是侧面朝右走。
  - 按图量步幅：`cycle` 分别为 .82、.93、.88、.85、.6（撑伞母女，两人平均）、.85（背包两人）。
  - 背娃的母亲原来只在原地挪步，现在有帧图的双人组也可以分配长路线（`extension-walkers.js`），她沿 -4827…-4062 往返。
  - 页面实录：`output/limited-animation/field-road-preview.gif`。
  - 第二批待做：路上站着的 8 位（递菜篮村妇 2 位、看篮孩童 2 位、聊天结伴游人 4 组），每位 3 格，俯视改平视。
- 2026-10-17 第四批：西郊田畴路上站着的 4 组，每组 3 格，脚不动，按脚底对齐。
  - `fields-03` 递菜篮村妇：端篮看菜 → 递出菜篮 → 拈菜给人看，`fields-03-basket-v1.json`。
  - `fields-11` 提篮村妇：挎篮站定 → 从篮中取菜 → 举菜招呼，`fields-11-basket-v1.json`。
  - `visitors-01` 指路父女：并肩站定 → 抬手远指 → 俯身讲给女儿，`visitors-01-point-v1.json`。
  - `visitors-03` 持卷交谈的两位文士：持卷候听 → 展卷诵读 → 摊手作答，`visitors-03-scroll-v1.json`。
  - 原图都是俯视或背影。提示词附两张参考图：第一张定人物，第二张（`bridge-17-cakes-v1.png`）只定平视视角和 3 格布局。
  - 已生成并安装，共 21 位使用关键帧。四张都一次通过安装检查。
  - 鞋底：下半身按 4 倍缩小逐像素比对第 1 格求偏移。`fields-03` 各格依次左漂 28、66 像素，`fields-11` 左漂 84、112，`visitors-03` 左漂 32、46。页面离屏复核，三组脚底在 2 像素（约 0.2 世界像素）内。
  - `visitors-01` 父女：第 3 格两人间距画近了约 47 像素，父亲 -30、女儿 +17，无法同时钉住。鞋底取两人中点，切到「俯身讲给女儿」时两人各挪约 2 世界像素，像父亲侧身凑近半步。若嫌明显，可让生图把第 3 格两人间距画得与第 1 格一致后重装。
  - 页面模块版本号随之更新（`limited-8/9`、`limited-4`），`manifest.json` 改为 `cache:'no-cache'` 请求，新装的帧图刷新即生效。
  - 田畴路上剩下的：看篮孩童 `fields-06`、`fields-14`，结伴游人 `visitors-05`、`visitors-06`。
- 求偏移的辅助方法：下半身区域按 4 倍缩小后逐像素比对，比肉眼读坐标准确，适合人物大部分不动、只有手和工具变化的帧图。

试看未安装的帧图：用 `--out output/limited-animation-try` 安装到其他目录，再打开 `extension-preview.html?limitedArt=output/limited-animation-try`。

## 实现

- `src/extension-limited-animation.js`：人物配置、帧时间表、逐格测量与对齐、加载与绘制。干活按脚底对齐（脚不动），走路按头部对齐（头稳、腿摆）。各格共用一个裁切框，换帧不缩放。显示高度以第 1 格（休息姿势）对应原人物高度。
- 只加载 `manifest.json` 里登记的帧图，未安装时不产生失败请求。
- 走路帧按走过的距离推进，每 0.35 倍身高走完四帧；停步时显示站立格，朝左走时整体镜像。
- 测试：`tests/extension-limited-animation.test.cjs`。
- 用假帧图（原图加倾斜和随机偏移）验证过：对齐会消除偏移，5 位人物在页面中正常换帧，无脚本错误。
- 2026-10-17 第五批（待生图）：其余全部 142 组的参考图和提示词已批量备好，清单见 `art-source/street-extension/limited-animation/batch-5-index.md`（按街区分组，可逐项勾选）。
  - 不含已有关键帧的 21 组，以及另行重绘的花肆街坊（`tea-15`…`tea-19`、`bridge-34/35`、`visitors-46/48/49/50`）、买花顾客 `visitors-47`、仓场搬夫 `mill-15`、女郎 `bridge-33`。
  - 走路 38 组（5 格，朝右，第二张参考图为 `bridge-23-walk-v1.png`，双人用 `visitors-04-walk-v1.png`）；原地动作 104 组（3 格，按角色写三个姿势，第二张参考图为 `fields-03-basket-v1.png`，双人用 `visitors-01-point-v1.png`；坐/蹲姿保留原坐具）。
  - 由 `node scripts/prepare-limited-animation-batch.mjs` 生成，已存在的文件不覆盖（`--force` 重建）。参考图按原图集格位与透明边界外扩 8 像素裁出。
  - 每个 JSON 带 `limited` 预设配置。安装脚本找不到已登记的人物时读取同名 JSON，安装后提示要写入 `LIMITED` 的配置；鞋底（干活）和 `cycle`（走路，暂定 .85）仍按生成图逐张标定。
- 2026-10-17 第五批 · 城门 31 组已安装，共 52 位使用关键帧。
  - `gate-03`、`gate-13`（蹲身叠布）生成时三姿势没有落在等宽格内，人物跨过格边。用 `node scripts/repack-limited-sheet.mjs <sheet.png> 3` 按透明列间隙拆开、重新等宽排列后安装；原图保留为 `*-v1-uneven.png`。
  - 鞋底先取自动脚底，再把每格最下方 10%（鞋与落地的筐、瓮、布堆）与第 1 格逐像素比对，扣除残余漂移后写入 `soles`。修正前残差最大约 12 像素（`gate-02`、`gate-13`、`gate-22`、`gate-27`），修正后各格脚底重合。
  - 浏览器 `extension-preview.html?at=-1150`、`?at=2600` 检查：31 张帧图全部加载，无脚本错误，人物立在街面上，姿势按时间线切换。模块缓存版本升到 `limited-9/10`、页面入口 `limited-5`。
