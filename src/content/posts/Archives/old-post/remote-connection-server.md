---
title: 本地远程连接云服务器上Docker下的MySQL
description: '虚拟机烧不动了，还是买了云服务器，先把环境再慢慢重新部署完吧。'
published: 2023-06-12 14:51:26
tags: ["Docker"]
category: 开发
---

**Linux**

```bash
docker ps
docker exec -it [container name] /bin/bash
mysql -u -p
# 对远程连接进行授权
GRANT ALL ON *.* TO 'root'@'%';
# 刷新权限
flush privileges;
```

**云服务器实例**

在网卡中新建安全组，新增MySQL规则。

![image-20231112145553920](image-20231112145553920.png)

**Navicat**

![image-20231112145738864](image-20231112145738864.png)

![image-20231112145752364](image-20231112145752364.png)
