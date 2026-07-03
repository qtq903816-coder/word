# WorkWord

一个面向 TOEIC、工作沟通和科技场景的背单词手机 App 初版。

## 初版功能

- 苹果手机 App 风格界面，底部四个入口：学习、复习、词库、进度
- 内置 90+ 个工作/TOEIC/科技词，每个词包含中文、搭配、例句和翻译
- 例句填空 + 选择题两种记忆方式
- 浏览器发音播放
- 本地保存学习进度、错词、连对次数
- 简单间隔复习逻辑：答错留在今日复习，连续两次正确标记掌握

## 后续可扩展

- 接入 CSV/JSON 词库导入
- 按行业扩展词包：外贸、研发、产品、财务、HR、客服
- 增加完整 SRS 复习间隔算法
- 增加每日计划、通知、离线 PWA 安装

## 开发

```bash
npm install
npm run dev
npm run build
```

## 手机打开

正式发布地址：

```text
https://qtq903816-coder.github.io/word/
```

如果还没有启用 GitHub Pages，需要在仓库 Settings -> Pages 里把 Source 设置为 GitHub Actions。

电脑和手机连接同一个 Wi-Fi 后，在电脑上运行：

```bash
npm run dev:phone
```

然后在手机浏览器访问：

```text
http://电脑局域网IP:5174
```

iPhone 可以在 Safari 里点分享按钮，再选择“添加到主屏幕”。
