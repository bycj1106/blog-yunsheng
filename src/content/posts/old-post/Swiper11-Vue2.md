---
title: Swiper11在Vue2项目中的使用
description: 'swiper11在vue2项目中的使用记录，有一些坑，好在爬出来了。'
published: 2024-04-10 19:37:05
category: 开发
tags: ["前端开发","Swiper"]
---

今年《天国：拯救 2》就要发售了，明年还有《GTA6》，期待( •̀ ω •́ )✧。

## swiper11 在 vue2 项目中的使用

因为公司使用的仍然是 vue2，所以被迫在 vue2 项目下进行 swiper11 的使用，而 swiper 的中文文档是有很多坑的，英文文档是基于 vue3 的，所以记录以下自己在 vue2 下使用 swiper11 的爬坑过程（￣︶￣）↗ 　。

虽然 swiper 中文网有很多坑，但是还是把[中文文档](https://swiper.com.cn/)和[官方文档](https://swiperjs.com/)都贴出来。

**安装**

尝试过 swiper7 版本，引入方式跟之后的版本很不一样，本文仅适用于 7 之后的版本。_安装 swiper7 及以前的版本采用我的方法的话会报错，无法使用。_

```bash
npm install swiper
```

**导入包**

正确的引入方式：

```vue
<script>
  import Swiper from "swiper";
  import "swiper/swiper-bundle.css";
</script>
```

**使用**

直接 copy 文档中的代码：

```vue
<template>
  <div class="swiper-demo">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="./assets/imges/1.png" alt="img-1" />
        </div>
        <div class="swiper-slide">
          <img src="./assets/imges/2.png" alt="img-1" />
        </div>
        <div class="swiper-slide">
          <img src="./assets/imges/3.png" alt="img-1" />
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <!-- If we need scrollbar -->
      <div class="swiper-scrollbar"></div>
    </div>
  </div>
</template>
```

```vue
<script>
  export default {
    mounted() {
      new Swiper(".swiper", {
        // Optional parameters
        loop: true,
        // If we need pagination
        pagination: {
          el: ".swiper-pagination",
        },
        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        // And if we need scrollbar
        scrollbar: {
          el: ".swiper-scrollbar",
        },
      });
    },
  };
</script>
```

到这里其实轮播图已经能正常显示了，关于 css 样式自行设置，这就是官方文档给出的使用方式，但是如果自己接着进行一下操作，马上就能发现问题。

如果自己操作一下的话，一定马上就能发现，分页器没有显示、左右导航键按了没反应，如果再尝试着加入`auto: true`的话，更会发现这个自动轮播功能根本就没有生效！

在网上找了很多，但都是老版本 swiper 或是 vue3 的，反正横竖不能解决问题，最后在查 swiper 的包时，终于发现了在其中有个`modules`文件夹，打开后马上恍然大悟，原来相关的模块都在这个文件夹里，要再引入！

那么接下来就简单了，正确的引入方式：

```vue
<script>
  import Swiper from "swiper";
  import { Autoplay, Pagination } from "swiper/modules";
  import "swiper/swiper-bundle.css";
  Swiper.use([Autoplay, Pagination]);
</script>
```

其中我只用了`autoplay`和`pagination`两个模块，需要什么再引入什么即可，再测试功能已能正常实现了。

## 图片的自适应问题

在写 banner 图时，发现一个问题，轮播图中使用的图片大小不同，会出现撑起的容器高度不一致，没法对其的情况，如果简单地采用明确的宽高(px 单位)，又无法自适应多种设备。

在网上找到了合适的教程，原理是使用 vw 解决，现简单的总结下：

1. 理解 vw 单位，即将视窗宽度分为 100 份，每份即为 1vw；
2. width 正常设置为 100%，然后设置`height: 需要图片的高度 / 设备宽度 * 100`，例如我需要的正常图片高度为 624px，设备宽度为 768px，那么`height: 624 / 750 * 100`，即可得到需要的高度；
3. 接下来使用到`object-fit: cover`，关于 object-fit，可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)；

[参考地址](https://www.cnblogs.com/echolun/p/11354416.html)
