# 多邻国风格摩斯密码学习程序实施计划

本项目将在 `D:\微信开发\OLD\tools\morse_learning.html` 下开发一个全新的多邻国(Duolingo)风格摩斯密码学习单页面应用(SPA)。该应用结合了游戏化机制与渐进式教学，帮助用户高效且趣味性地掌握26个字母和数字的摩斯密码。

## 核心设计与优化点

1. **图形化联想记忆叠加层 (Mnemonic Overlay)**：
   - 融合 `morse_position_editor.html` 的核心设计思路。在“关卡前预览速记卡”和“答题错误时的解析”中，字母背后会以 200px Roboto 极粗字体展示，并在该字母的笔画上，通过精确绝对定位（`left`, `top`, `rotate`）叠加显示高亮/霓虹质感的黑色或彩色的点（dot）与划（dash）。
   - 让用户在视觉上直观地看到摩斯码如何嵌在字母的骨架上，提供强烈的物理视觉记忆暗示，降低记忆门槛。
2. **关卡前预览 (预览速记卡)**：每关开始前增加一个“本关学习卡片”展示环节，列出本关需掌握的字母/数字及其摩斯码（带上述图形联想和点击发音），用户熟悉后再正式开始测试。
3. **错题重练机制**：关卡中答错的题目不会立刻终结课程，而是展示正确答案（带图形联想解析），并将该题重新加入当前关卡的题库末尾，直到用户完全答对或生命值耗尽，确保“掌握式学习”。
4. **柔和的游戏化生命值与XP闭环**：
   - 基础生命值为 5 颗心（前3关），第4关起恢复为标准的 3 颗心。答错扣 1 颗心。
   - 生命值为 0 时关卡失败，弹出结算模态框。用户可选择**花费 50 XP 补满生命值继续**，或**免费重新开始**。
   - 通关一关可获得 15 XP，如果完美无错通关，额外奖励 5 XP。
5. **精细的音频时序与 Web Audio 调度**：
   - 使用 Web Audio API 的 `currentTime` 时间轴进行前瞻调度，避免 `setTimeout` 漂移导致的电报音节奏不均，并在边界使用线性渐变消除爆音。
   - 音频时值：基准点(dot) = 80ms，划(dash) = 240ms。
   - 元素间隔(点与划之间) = 80ms，字符间隔 = 240ms，单词间隔 = 560ms。频率固定为 680Hz 正弦波。
6. **听音慢速模式 (乌龟按钮)**：
   - 在听音辨字题型中，除正常播放按钮外，增加一个慢速播放按钮（乌龟图标）。
   - 点击乌龟按钮时，基准时间拉长为 1.6 倍（即 dot = 128ms, dash = 384ms），大幅降低初学者听辨门槛。
7. **S-Curve 蜿蜒关卡树布局**：
   - 主页关卡按钮不再使用死板的网格，而是通过交替应用左右外边距（例如 `-40px`, `0`, `40px`）实现类似多邻国的蛇形蜿蜒路径。
8. **配对连线题交互**：
   - 采用“两次点击法”：点击左侧一列（字母），再点击右侧一列（摩斯码）进行配对。
   - 配对成功：两者连线变绿并标记为已配对状态，不可再点击，保持布局不剧烈跳动。
   - 配对失败：短暂闪红，取消选择状态。
9. **桌面端极客键盘快捷键**：
   - 在输入摩斯码题型中，支持键盘 `.`（或数字键盘）输入点，`-` 输入划，`Backspace` 退格，`Enter` 提交/继续。
   - 在选择题中，支持数字键 `1`, `2`, `3`, `4` 选择对应选项。
10. **综合练习功能**：
    - 首页底部的“综合练习”按钮在用户通关第 1 关后解锁。
    - 随机从已解锁的所有关卡中抽题，不扣减生命值，通关可获得 5 XP。
11. **高质感图形化点划组件 (Visual Morse)**：
    - 废弃传统的 `.-` 纯文本符号，使用纯 CSS 渲染的圆角点划微章组件。
    - “点”渲染为直径 12px 的正圆圈，“划”渲染为 32px * 12px 的圆角矩形，两者通过 flex 水平排列，并带有柔和的蓝色主题色填充。
    - 应用于预览卡片、答题反馈信息、选择题题干以及摩斯码键盘输入显示屏中，彻底解决纯文本 `.-` 看不清、字形参差不齐的排版痛点。

---

## 页面结构与设计规范

### 1. 配色系统 (Duolingo 风格)
- **主绿色**：`#58CC02` (按钮背景、解锁关卡)
- **深绿色(阴影)**：`#46A302` (按钮三维立体阴影)
- **边框灰**：`#E5E5E5`
- **文字深灰**：`#3C3C3C`
- **错误红**：`#FF4B4B` / 错误阴影 `#EA2B2B`
- **背景浅灰/白**：`#FFFFFF` / 页面背景 `#F7F7F7`
- **金黄色(星星/XP)**：`#FFC800`

### 2. 状态与过渡动画
- **立体按钮按压**：通过 `transform: translateY(4px)` 和 `box-shadow` 缩小的配合实现逼真的按压反馈。
- **答题正确**：屏幕底部弹出绿色反馈栏，伴随 Web Audio 合成的上行双音音效（例如 880Hz 到 1200Hz）。
- **答题错误**：输入卡片发生左右抖动 (CSS Shake)，底部弹出红色反馈栏，生命值心形图标抖动并缩小，伴随低频蜂鸣音效（220Hz）。
- **彩纸飘落**：结算页在获得 3 星时，用 Canvas 绘制彩色碎屑飘落动画。

### 3. 三大主屏幕切换 (DOM 切换)
- **HomeScreen (主页)**：
  - 顶部状态栏：Streak连续天数(火焰)、累计XP、生命值(心形图标)。
  - 中间关卡树：14个关卡，S形蜿蜒排布，带锁/通关状态区分。
  - 底部控制区：综合练习按钮、[ ⚠️ 重置所有数据 ] 按钮（需二次确认）。
- **LessonScreen (关卡页)**：
  - 顶部进度栏：返回按钮 ✖、进度条(当前完成题数/10)、生命值剩余。
  - 中部答题区：
    - 阶段1：关卡卡片预览（展示本关字母、点划融合记忆图，提供“准备好了”按钮，支持点击依次播放）。
    - 阶段2：动态生成的 4 种题型（听音辨字、输入摩斯码、配对连线、翻译识别）。
  - 底部操作栏：检查按钮 (Check) / 下一步按钮 (Continue)。
- **ResultScreen (结算页)**：
  - 顶部星级：根据正确率（错题重练不算首次答对）展示 1-3 颗金星。
  - 结算数据：展示本关获得的 XP、正确率。
  - 底部按钮：回到主页。

---

## 关卡结构 (共 14 关)

1. **关卡 1**: E (`.`) & T (`-`)
2. **关卡 2**: I (`..`) & M (`--`)
3. **关卡 3**: A (`.-`) & N (`-.`)
4. **关卡 4**: S (`...`) & O (`---`)
5. **关卡 5**: H (`....`) & G (`--.`)
6. **关卡 6**: D (`-..`) & U (`..-`)
7. **关卡 7**: R (`.-.`) & K (`-.-`)
8. **关卡 8**: B (`-...`) & V (`...-`)
9. **关卡 9**: L (`.-..`) & F (`..-.`)
10. **关卡 10**: C (`-.-.`) & Y (`-.--`)
11. **关卡 11**: P (`.--.`) & W (`.--`) & J (`.---`)
12. **关卡 12**: Q (`--.-`) & X (`-..-`) & Z (`--..`)
13. **关卡 13**: 数字 1-5 (`.----` 到 `.....`)
14. **关卡 14**: 数字 6-0 (`-....` 到 `-----`)

---

## 核心算法与数据设计

### 1. 字母-点划联想叠加位置字典 (A-Z)
```javascript
const letterVisualConfigs = {
    'A': [
        { type: 'dot', left: 28, top: 40, rotate: 0 },
        { type: 'dash', left: 70, top: 52, rotate: 30 }
    ],
    'B': [
        { type: 'dash', left: 22, top: 50, rotate: 0 },
        { type: 'dot', left: 65, top: 25, rotate: 0 },
        { type: 'dot', left: 68, top: 50, rotate: 0 },
        { type: 'dot', left: 65, top: 75, rotate: 0 }
    ],
    'C': [
        { type: 'dash', left: 55, top: 20, rotate: -30 },
        { type: 'dot', left: 22, top: 42, rotate: 0 },
        { type: 'dash', left: 50, top: 80, rotate: 20 },
        { type: 'dot', left: 78, top: 68, rotate: 0 }
    ],
    'D': [
        { type: 'dash', left: 22, top: 50, rotate: 0 },
        { type: 'dot', left: 70, top: 30, rotate: 0 },
        { type: 'dot', left: 70, top: 70, rotate: 0 }
    ],
    'E': [
        { type: 'dot', left: 50, top: 50, rotate: 0 }
    ],
    'F': [
        { type: 'dot', left: 25, top: 25, rotate: 0 },
        { type: 'dot', left: 60, top: 25, rotate: 0 },
        { type: 'dash', left: 25, top: 60, rotate: 0 },
        { type: 'dot', left: 65, top: 50, rotate: 0 }
    ],
    'G': [
        { type: 'dash', left: 50, top: 20, rotate: 0 },
        { type: 'dash', left: 25, top: 55, rotate: 0 },
        { type: 'dot', left: 68, top: 70, rotate: 0 }
    ],
    'H': [
        { type: 'dot', left: 22, top: 20, rotate: 0 },
        { type: 'dot', left: 22, top: 80, rotate: 0 },
        { type: 'dot', left: 78, top: 20, rotate: 0 },
        { type: 'dot', left: 78, top: 80, rotate: 0 }
    ],
    'I': [
        { type: 'dot', left: 50, top: 25, rotate: 0 },
        { type: 'dot', left: 50, top: 75, rotate: 0 }
    ],
    'J': [
        { type: 'dot', left: 50, top: 20, rotate: 0 },
        { type: 'dash', left: 80, top: 45, rotate: 0 },
        { type: 'dash', left: 75, top: 75, rotate: 30 },
        { type: 'dash', left: 35, top: 85, rotate: 75 }
    ],
    'K': [
        { type: 'dash', left: 22, top: 50, rotate: 0 },
        { type: 'dot', left: 52, top: 50, rotate: 0 },
        { type: 'dash', left: 65, top: 75, rotate: -45 }
    ],
    'L': [
        { type: 'dot', left: 22, top: 20, rotate: 0 },
        { type: 'dash', left: 22, top: 60, rotate: 0 },
        { type: 'dot', left: 52, top: 85, rotate: 0 },
        { type: 'dot', left: 82, top: 85, rotate: 0 }
    ],
    'M': [
        { type: 'dash', left: 25, top: 50, rotate: 15 },
        { type: 'dash', left: 75, top: 50, rotate: -15 }
    ],
    'N': [
        { type: 'dash', left: 22, top: 50, rotate: 0 },
        { type: 'dot', left: 78, top: 80, rotate: 0 }
    ],
    'O': [
        { type: 'dash', left: 26, top: 50, rotate: 15 },
        { type: 'dash', left: 74, top: 50, rotate: -15 },
        { type: 'dash', left: 50, top: 15, rotate: 90 }
    ],
    'P': [
        { type: 'dash', left: 22, top: 50, rotate: 0 },
        { type: 'dot', left: 65, top: 22, rotate: 0 },
        { type: 'dash', left: 75, top: 45, rotate: 0 },
        { type: 'dot', left: 65, top: 65, rotate: 0 }
    ],
    'Q': [
        { type: 'dash', left: 30, top: 40, rotate: 15 },
        { type: 'dash', left: 70, top: 40, rotate: -15 },
        { type: 'dot', left: 50, top: 75, rotate: 0 },
        { type: 'dash', left: 72, top: 80, rotate: 45 }
    ],
    'R': [
        { type: 'dot', left: 22, top: 20, rotate: 0 },
        { type: 'dash', left: 55, top: 40, rotate: 30 },
        { type: 'dot', left: 68, top: 78, rotate: 0 }
    ],
    'S': [
        { type: 'dot', left: 45, top: 22, rotate: 0 },
        { type: 'dot', left: 50, top: 50, rotate: 0 },
        { type: 'dot', left: 55, top: 78, rotate: 0 }
    ],
    'T': [
        { type: 'dash', left: 50, top: 15, rotate: 90 }
    ],
    'U': [
        { type: 'dot', left: 22, top: 25, rotate: 0 },
        { type: 'dot', left: 78, top: 25, rotate: 0 },
        { type: 'dash', left: 50, top: 80, rotate: 90 }
    ],
    'V': [
        { type: 'dot', left: 25, top: 20, rotate: 0 },
        { type: 'dot', left: 32, top: 45, rotate: 0 },
        { type: 'dot', left: 40, top: 70, rotate: 0 },
        { type: 'dash', left: 68, top: 50, rotate: -18 }
    ],
    'W': [
        { type: 'dot', left: 18, top: 25, rotate: 0 },
        { type: 'dash', left: 42, top: 60, rotate: 12 },
        { type: 'dash', left: 78, top: 45, rotate: -25 }
    ],
    'X': [
        { type: 'dash', left: 50, top: 50, rotate: -40 },
        { type: 'dot', left: 28, top: 75, rotate: 0 },
        { type: 'dot', left: 72, top: 25, rotate: 0 },
        { type: 'dash', left: 35, top: 38, rotate: 40 }
    ],
    'Y': [
        { type: 'dash', left: 30, top: 30, rotate: 30 },
        { type: 'dot', left: 50, top: 52, rotate: 0 },
        { type: 'dash', left: 70, top: 30, rotate: -30 },
        { type: 'dash', left: 50, top: 80, rotate: 0 }
    ],
    'Z': [
        { type: 'dash', left: 50, top: 15, rotate: 90 },
        { type: 'dash', left: 50, top: 50, rotate: -50 },
        { type: 'dot', left: 25, top: 85, rotate: 0 },
        { type: 'dot', left: 75, top: 85, rotate: 0 }
    ]
};
```

### 2. Web Audio 播放器调度实现
```javascript
class MorsePlayer {
    constructor() {
        this.audioCtx = null;
        this.frequency = 680;
        this.oscillator = null;
        this.gainNode = null;
    }
    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
    play(morseCode, speedMultiplier = 1.0) {
        this.init();
        this.stop();
        const baseUnit = 80 * speedMultiplier;
        const dotDuration = baseUnit / 1000;
        const dashDuration = (baseUnit * 3) / 1000;
        const intraGap = baseUnit / 1000;
        let time = this.audioCtx.currentTime + 0.05;

        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = this.frequency;
        this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

        for (let i = 0; i < morseCode.length; i++) {
            const char = morseCode[i];
            if (char === '.' || char === '-') {
                const duration = (char === '.') ? dotDuration : dashDuration;
                this.gainNode.gain.setValueAtTime(0, time);
                this.gainNode.gain.linearRampToValueAtTime(0.8, time + 0.005);
                this.gainNode.gain.setValueAtTime(0.8, time + duration - 0.005);
                this.gainNode.gain.linearRampToValueAtTime(0, time + duration);
                time += duration + intraGap;
            }
        }
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.oscillator.start();
        this.oscillator.stop(time);
    }
    stop() {
        if (this.oscillator) {
            try { this.oscillator.stop(); } catch(e){}
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
    playFeedbackSound(isCorrect) {
        this.init();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        if (isCorrect) {
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(1174, now + 0.08); // 快速上行双音
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
            gain.gain.setValueAtTime(0.5, now + 0.2);
            gain.gain.linearRampToValueAtTime(0, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else {
            osc.frequency.setValueAtTime(220, now); // 低沉蜂鸣
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.6, now + 0.01);
            gain.gain.setValueAtTime(0.6, now + 0.25);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }
}
```

---

## Proposed Changes

### 游戏前端模块

#### [MODIFY] [morse_learning.html](file:///D:/微信开发/OLD/tools/morse_learning.html)
- **修复未学字符干扰 Bug**：
  - 在 `startLesson` 初始化当前关卡的 `currentLesson.learnedPool`（包含当前关卡及之前所有已解锁的字母和数字）。
  - 在生成干扰项 `generateOptions` 和配对连线题补充选项时，优先从 `learnedPool` 中选择非主测试字符的已学字符。仅在极其早期的关卡（已学字符总数少于 4 个）时，才允许从全局字典中随机选取进行兜底。
- **高质感圆角点划组件 (Visual Morse)**：
  - 添加 `getMorseVisualHtml(morseCode)` 函数，用于将 `.-` 格式的摩斯码解析为纯 CSS 渲染的圆角符号徽章（“点”为 12px 圆圈，“划”为 32px * 12px 圆角矩形）。
  - 替换预览卡片、答题反馈信息、选择题题干以及摩斯码键盘输入显示屏中的纯文本 `.-` 输出，使用上述视觉点划组件渲染。
  - 在 CSS 中为 `.morse-visual-container` 和 `.morse-visual-char` 编写响应式排版样式，使其垂直居中、间距匀称，且根据反馈栏（正确/错误）自动改变点划颜色。

---

## Verification Plan

### 自动化与脚本验证
- 控制台无报错，响应式布局（适配 360px ~ 1200px 宽度）。
- 数据状态自动保存至 `localStorage` 并在刷新后保持同步。

### 手动验证步骤
1. **点划位置在字母上叠加（图形化记忆）验证**：
   - 启动关卡 1，进入预览卡片，验证字母 `E` 和 `T` 背景是否为 Roboto 粗体字母，并且其笔画上是否精确叠加了对应的点/划元素。
   - 在答题错误时弹出的答案解析框中，检查是否同样呈现该点划字母叠加记忆图，以辅助用户记忆。
2. **主页 S-Curve 路径与重置验证**：
   - 检查关卡排布是否为蛇形，通关第 1 关后第 2 关和底部的“综合练习”按钮均正常解锁。
   - 点击“重置数据”按钮，弹出二次确认，确认后数据清零并恢复初始锁死状态。
3. **预览与慢速模式验证**：
   - 开启关卡题型，在听音题中点击“正常播放”和“乌龟慢速播放”按钮，对比音频语速是否明显拉长且无劈音爆音。
4. **答题交互与错题重练**：
   - 输入摩斯码题：使用键盘 `.` 和 `-` 可顺畅输入，`Enter` 可完成提交与下一步切换。
   - 答错一题：生命值减 1，听到低沉蜂鸣声且屏幕抖动，并且确认该错题重新回到题库队列尾部，直到再次答对。
   - 答错扣血至 0：弹出重新开始或用 50 XP 购买生命值继续。
5. **结算持久化**：
   - 完美通关获得 15 + 5 = 20 XP，页面出现 Canvas 彩色纸屑飘落。
   - 刷新网页，确认 XP、进度以及 Streak 均被正确持久化。
