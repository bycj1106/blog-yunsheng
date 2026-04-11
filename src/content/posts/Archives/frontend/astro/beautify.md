---
title: 鼠标点击爆炸特效美化
published: 2025-04-11
description: "简单的鼠标点击爆炸特效。"
tags: ["美化"]
category: 工具
---

继续处理博客的升级工作，决定把旧框架下的鼠标点击爆炸特效移植过来。这是在之前的 Hexo 博客中使用过的功能，链接是[hexo 博客美化](https://blog-yunsheng.cn/posts/old-post/hexo-beautify/)。这个特效让页面点击时出现彩色粒子爆炸。

[使用的文件](http://blog-yunsheng.cn/utils/fireworks.min.js)

接下来，在 `Layout` 文件的 `<body>` 标签内添加必要的元素。过程很顺利，我把代码保存为一个单独的 JS 文件，然后引入它。具体的添加部分是：

```html
<canvas
  id="fireworks"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 32767"
></canvas>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"
></script>
<script type="text/javascript" src="/utils/fireworks.min.js"></script>
```

*要让该JS能在线上（生产环境）被访问，必须把它放到 `Astro` 项目的 `public` 目录下。*
