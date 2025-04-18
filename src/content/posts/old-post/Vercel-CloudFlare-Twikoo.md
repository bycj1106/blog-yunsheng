---
title: Vercel+CloudFlare实现近零成本Twikoo评论系统CDN加速
description: '6块钱一年的奶茶（域名）钱，加一两个小时的宝贵时间，同样也可用于网站加速等等。'
published: 2023-11-23 09:54:03
category: 开发
image: "https://wallhalla.com/wallpaper/1/variant/preview/lg"
tags: ["Twikoo","CDN","CloudFlare"]
---

## 问题分析

可以通过Vercel对Twikoo评论系统服务进行免费的部署，但因为`*.vercel.app`因某种不可抗力在国内无法访问，所以用到了CloudFlare的免费CDN服务，来实现对评论系统的加速，实现国内网络环境也能访问的效果。

## 前置工作

已在Vercel成功部署Twikoo。

CloudFlare账户。

至少4块钱。

## 解决过程

成本一共6元钱——在腾讯云随便注册一个便宜的域名。

***腾讯云控制台***

在域名DNS解析里选快速添加解析，输入Vercel中项目的Domains地址，例如`*.vercel.app`，快速添加解析记录。

***Vercel***

进入Domains界面下，添加刚注册域名的域名，选择第三项，添加。

***CloudFlare***

点击`add site`输入自己的域名，一直下一步。

按照CloudFlare提示更换nameservers，具体为在腾讯云控制台，进入我的域名，选择修改DNS服务器，将CloudFlare提供的DNS服务器添加上去。

等待一段时间即可。

## 后记

因为免费的CloudFlare服务，其服务器在中国以外，实际上并不稳定，但是已经比原本一定不能访问到要强很多了，偶尔评论系统连接出现问题属正常现象。

关于[CDN访问异常之重定向次数过多](https://blog-yunsheng.cn/2023/11/21/CDN访问异常之重定向次数过多/)的问题，在我的上一篇文章里有写过了，遇到问题的伙伴可以看看，希望能有所帮助。
