---
title: hexo博客美化
description: '一些自定义美化组件引用方法，虽然这些内容花了我不少时间才弄好，但还是属于文字垃圾，对不起我太菜了::>_<::。'
published: 2023-04-12 14:00:29
category: 工具
image: https://wallhalla.com/wallpaper/50/variant/preview/lg
tags: [ "hexo", "美化"]
---

## 鼠标点击爆炸特效

在制作完评论系统后逛博客时看到的不错的烟花爆炸特效[博文地址](https://blog.yuzi.dev/posts/49f7102e.html)。

在 `Blog\themes\particlex\source\js` 目录下创建文件 [fireworks.min.js](http://blog-yunsheng.cn/js/fireworks.min.js) 。

在 `Blog\themes\particlex\layout` 目录下打开 `layout.ejs` 文件，添加：

```html
<canvas
	id="fireworks"
	style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 32767"
></canvas>
<script src="https://cdn.staticfile.org/animejs/3.2.1/anime.min.js"></script>
<script src="/js/fireworks.min.js"></script>
```

## 流星雨特效

根据主题作者的[原教程](https://argvchs.netlify.app/2022/04/17/hexo-blog-3/)使用。

在 `Blog\themes\particlex\source\js` 目录下创建文件 [background.min.js](http://blog-yunsheng.cn/js/background.min.js) 。

在 `Blog\themes\particlex\layout` 目录下打开 `layout.ejs` 文件，添加：

```html
<canvas
    id="background"
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1"
></canvas>
<script src="/js/background.min.js"></script>
```

**补充**

要将背景图片层级上移，在 `Blog\themes\particlex\source\css` 目录下对 `main.css` 文件进行修改：

```html
#home-head #home-background {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    left: 0;
    position: absolute;
    top: 0;
    width: 100vw;
    z-index: 0;
}
```

## 代码雨特效

在 `Blog\themes\particlex\source\js` 目录下创建文件  [digitalrain.min.js](http://blog-yunsheng.cn/js/digitalrain.min.js) 

在 `Blog\themes\particlex\source\css` 目录下创建文件  [digitalrain.min.css](http://blog-yunsheng.cn/js/digitalrain.min.css) 

在 `Blog\themes\particlex\layout` 目录下打开 `layout.ejs` 文件，添加：

```html
<!-- 数字雨 -->
<canvas id="canvas" width="1440" height="900" ></canvas>
<link rel="stylesheet" href="/css/digitalrain.min.css" />
<script type="text/javascript" src="/js/digitalrain.min.js"></script>
```

**补充**

因为在 `layout.ejs` 文件下设置会在全局生效，而代码雨在文章页会显得非常乱，所以我把其挪到了 `index.ejs` 文件下，然后将流星雨特效放回 `layout.ejs` 文件，即可实现代码雨特效仅在主页生效。
