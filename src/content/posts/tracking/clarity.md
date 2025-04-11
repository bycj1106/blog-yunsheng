---
title: 快速上手 Google Tag Manager (GTM) 与 Microsoft Clarity 集成教程
published: 2024-12-12
description: "Clarity - 微软大哥的永久免费的用户行为分析工具。"
# image: "./cover.jpeg"
tags: ["Clarity", "埋点"]
category: 开发
draft: false
---

在网站分析和用户行为追踪中，Google Tag Manager (GTM) 是一个强大的工具，可以帮助我们轻松管理各种追踪代码。而 Microsoft Clarity 则是一款优秀的用户行为分析工具，能够提供热图、会话录制等功能。

---

## 一、创建 Google Tag Manager (GTM) 账号和容器

1. **访问 GTM 官网**  
   打开 [GTM 官网](https://tagmanager.google.com/)，使用你的 Google 账号登录。
   
2. **创建账号和容器**  
   - 点击“创建账号”，填写账号名称（通常是公司或项目名）。
   - 创建一个新的“容器”，选择“网页”类型，并输入网站域名。
   - 完成设置后，GTM 会生成两段代码，用于嵌入到你的网站中。

---

## 二、将 GTM 代码嵌入网站

1. **获取 GTM 代码**  
   创建容器后，GTM 会提供两段代码：一段放在 `<head>` 标签内，另一段放在 `<body>` 标签内。

2. **嵌入代码到项目**  
   - 找到项目的主布局文件（通常是 `Layout` 文件）。
   - 将第一段代码粘贴到 `<head>` 标签的最前面。
   - 将第二段代码粘贴到 `<body>` 标签的最前面。

3. **解决 TypeScript 报错（可选）**  
   如果你的项目使用 TypeScript (ts)，可能会在 `<script>` 标签处报错。解决方法是给 `<script>` 标签加上 `type="text/javascript"` 属性，例如：
   ```html
   <script type="text/javascript">
     // GTM 代码内容
   </script>
   ```

4. **发布并测试**  
   - 代码嵌入完成后，部署你的网站。
   - 使用浏览器开发者工具或 GTM Preview 模式测试，确保代码正常运行，无报错。

---

## 三、通过 GTM 集成 Microsoft Clarity

1. **访问 Microsoft Clarity 官网**  
   打开 [Clarity 官网](https://clarity.microsoft.com/)，使用 Microsoft 账号登录。

2. **创建新项目**  
   - 点击“新建项目”，填写项目名称和网站 URL。
   - 选择“在第三方平台上安装”，然后选择“Google Tag Manager (GTM)”作为集成方式。

3. **连接 GTM 项目**  
   - Clarity 会生成一段代码或指引你完成连接。
   - 在 GTM 界面中，创建一个新的“标签”，选择“自定义 HTML 标签”，将 Clarity 提供的代码粘贴进去。
   - 设置触发器为“所有页面”，确保代码在每个页面加载时触发。
   - 保存并发布 GTM 容器。

---

## 四、等待数据同步

- 完成以上步骤后，通常需要等待几个小时（视网站流量而定），Clarity 才会开始显示数据。
- 登录 Clarity 仪表板，查看热图、会话录制等用户行为数据，确保一切正常。

---

## 五、总结与注意事项

通过以上步骤，你已经成功将 GTM 集成到网站，并通过 GTM 连接了 Microsoft Clarity，用于用户行为分析。以下是一些注意事项：
- 确保 GTM 代码正确嵌入，避免因位置错误导致追踪失败。
- 定期检查 GTM 和 Clarity 的数据，确保没有异常。
- 如果网站有多个子域名或复杂结构，可能需要额外配置 GTM 容器。

