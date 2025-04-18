---
title: 通过SSH连接虚拟机及其中Docker下的MySQL数据库
description: '记录一下虚拟机网络之间连接的实现。'
published: 2023-06-10 21:10:11
category: 开发
tags: ["SSH", "Docker"]
---

# 通过SSH连接虚拟机

## Oracle VM VirtualBox

![image-20231110211142826](image-20231110211142826-1699621908213-1.png)

![image-20231110211206278](image-20231110211206278-1699621927347-3.png)

## MobaXterm

![image-20231110211237429](image-20231110211237429.png)

# 连接其中Docker下的MySQL数据库

在Docker中成功启动MySQL，确认Docker中MySQL无问题。

在Oracle VM VirtualBox中给端口转发列表添加Docker中映射的端口。

在宿主机中打开cmd，用`ipconfig`查到虚拟机ip地址。

打开Navicat，输入对应信息即测试连接。
