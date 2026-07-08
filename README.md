# WorkWord

面向 TOEIC、工作沟通和科技场景的背单词手机 App。

## 功能

- 苹果手机 App 风格界面，底部四个入口：学习、复习、词库、进度
- 公开词表生成的 200+ 工作/TOEIC/科技词库
- 每个词包含中文、词性、搭配、例句、翻译、来源字段
- 例句填空 + 选择题
- 浏览器发音播放
- 本地保存学习进度、错词、连对次数

## 数据来源

词库由脚本生成，不直接复制商业背词网站内容。

- NGSL / TSL / BSL：CC BY-SA 4.0
- ECDICT mini：MIT
- 科技场景补充词：项目内维护

生成脚本：

```bash
npm run import:words
```

## 开发

```bash
npm install
npm run import:words
npm run dev
npm run build
```

## 手机打开

正式发布地址：

```text
https://qtq903816-coder.github.io/word/
```

电脑和手机连接同一个 Wi-Fi 后，在电脑上运行：

```bash
npm run dev:phone
```

然后在手机浏览器访问：

```text
http://电脑局域网IP:5174
```

iPhone 可以在 Safari 里点分享按钮，再选择“添加到主屏幕”。
