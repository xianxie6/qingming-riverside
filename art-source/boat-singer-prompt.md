# 船头弹唱女子 · 生成提示词

用于续卷河面的一条船：一位女子坐在船头抱琵琶弹奏并歌唱。
生成后放到 `assets/boat-singer-v1.png`，由 `src/river-boats.js` 切成 4 帧循环播放。

## 提示词（英文，直接粘贴）

```
A character sprite sheet for a Northern Song dynasty river scroll, in the exact style of a fine Chinese gongbi illustration: thin even ink outlines, soft muted mineral watercolor washes, subtle paper-grain texture, no hard shading, no modern rendering.

Subject: one graceful young Song dynasty woman, a river-boat musician, seated on a low round straw cushion with her legs folded to one side, playing a pipa (Chinese lute) held upright on her lap, and singing. Side three-quarter view, body facing RIGHT, face turned slightly toward the viewer. Hair in a neat high Song-style bun with one small jade hairpin and a pale ribbon. Clothing: a light jade-green short jacket (beizi) over a pale apricot inner top, a long soft rose-pink pleated skirt spread on the cushion, a thin translucent pale sash. Calm, elegant, natural proportions, adult woman, modest dress.

Layout: ONE horizontal row of 4 frames of the SAME woman, evenly spaced in 4 equal-width cells, for a looping animation. Keep her cushion, hips, legs, skirt and the pipa body in the IDENTICAL position, size and outline in every frame; only her right (plucking) hand, left fingers on the neck, head and mouth change:
1. Right hand plucking downward across the strings, lips gently parted, starting to sing.
2. Right hand lifted after the stroke, fingers spread, mouth open singing a clear note, chin slightly raised.
3. Right hand fingers rolling on the strings (tremolo), eyes half-closed, head tilted softly to one side, sustaining the note.
4. Right hand resting lightly near the strings, mouth softly closed in a smile, left fingers pressing a new fret.

Pure plain white background (#FFFFFF), no ground, no boat, no shadow under the figure, no water, no border, no text, no seal, no watermark. Full figure fully inside each cell with generous white margin. Same scale and same baseline in all 4 cells. Image size 3072 × 1024.
```

## 中文说明

- **画风**：与 `featured-characters-v7` 的船夫一致，细墨线加淡设色，人物在画面里才不跳。
- **4 帧同一人**：坐垫、下半身、琵琶琴身每帧必须完全重合，只动右手、左手手指、头和嘴，程序才能把它们无缝循环成"弹、唱、轮指、换把"的动作。
- **朝右**：船头在右侧，她面朝船头方向坐；程序会在船反向行驶时自动镜像。
- **纯白底**：程序会按船夫同样的方式自动抠掉白底，不要阴影和地面。
- 如果某一帧坐姿偏了，可以只重生那一帧，或告诉我，我在程序里按骨盆位置对齐。
