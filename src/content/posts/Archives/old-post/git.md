---
title: 用Git上传项目到GitHub或Gitee
description: '需要提前配置好Git，以下是上传本地项目到GitHub或Gitee的方法的简单记录，GitHub仓库与Gitee仓库上传方法通用。'
category: 开发
tags: ["Git"]
published: 2022-04-12 00:19:50
---


# 上传本地项目到GitHub

在GitHub上创建一个仓库，进入仓库，点击 `code` ，在展开菜单内复制仓库路径。

***

## Git全局设置

*全局环境已设置可略过*

```bash
$ git config --global user.name "云升"
$ git config --global user.email "bycj1106@163.com"
```

### 用Git上传到仓库

``` bash
$ mkdir 项目名 #一般略过这一段！
$ git init
$ touch README.md
$ git add README.md
$ git commit -m "first commit"
$ git remote add origin git@gitee.com:Gitee仓库路径.git
$ git push -u origin "main" #Gitee上似乎是master
```

## Git的部分指令注释

``` bash
$ git init #把这个目录变成Git可以管理的仓库
$ git add README.md #文件添加到仓库
$ git add . #不但可以跟单一文件，还可以跟通配符，更可以跟目录。一个点就把当前目录下所有未追踪的文件全部add了 
$ git commit -m "first commit" #把文件提交到仓库
$ git remote add origin git@github.com:wangjiax9/practice.git #关联远程仓库
$ git push -u origin master #把本地库的所有内容推送到远程库上
```

## .gitignore文件的使用方法

``` 
# dir 不需要提交的目录
/node_modules
​
# file 不需要提交的文件
config.ini
​
# log 不需要提交的任意包含后缀名为log的文件
*.log
​
# Package Files 不需要提交的任意包含后缀名为jar的文件
*.jar
```

# 简明指南

[git 简明指南 (runoob.com)](https://www.runoob.com/manual/git-guide/)
