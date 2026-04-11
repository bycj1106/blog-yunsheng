---
title: 解决腾讯云服务器无法连接GitHub
published: 2026-04-11
description: '解决腾讯云服务器在国内访问 GitHub 时经常遇到连接超时或无法解析的问题。'
image: ''
tags: ['网络问题', 'GitHub', '腾讯云']
category: '运维'
draft: false 
lang: ''
comments: true
---

**问题描述**

腾讯云服务器在国内访问 GitHub 时经常遇到连接超时或无法解析的问题。

**解决思路**

通过手动修改 `hosts` 文件，将 GitHub 域名解析到可用的 IP 地址。

**操作步骤**

### 第一步：查询可用 IP 地址

访问 [IP 地址查询网站](https://www.ip138.com/)，查询以下域名的 DNS 解析地址：

- `github.com`
- `raw.githubusercontent.com`

> **建议**：优先选择美国节点的 IP 地址，新加坡节点可能存在问题。

### 第二步：目前获取到的可用 IP

| 域名 | IP 地址 |
| --- | --- |
| `github.com` | `140.82.116.3` |
| `raw.githubusercontent.com` | `185.199.108.133` |

### 第三步：修改 hosts 文件

```bash
# 编辑 hosts 文件
sudo vim /etc/hosts
```

添加以下内容：

```text
140.82.116.3 github.com
185.199.108.133 raw.githubusercontent.com
```

### 第四步：验证连接

```bash
ping github.com
ssh -T git@github.com
```

---

**注意事项**

- 如遇连接问题，可定期更新 `hosts` 文件中的 IP 地址
- 若使用代理或 VPN，请确保配置正确