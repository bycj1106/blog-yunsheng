---
title: 使用Clarity埋点（通过GTM安装）
published: 2024-12-12
description: "微软大哥的永久免费的用户行为分析工具。"
# image: "./cover.jpeg"
tags: ["Clarity", "埋点"]
category: 开发
draft: true
---

在[GTM官网](https://tagmanager.google.com/)创建账号和容器。

将GTM给的代码分别按照提示放到 `Layout` 文件（一般情况下的页面主文件）中 `<head>` 和 `<body>` 标签最前面的的位置。

如果用的是 `ts`，会提示报错，给 `<script>` 标签加上 `type="text/javascript"` ，即 `<script type="text/javascript">`。

测试一下有无问题。


