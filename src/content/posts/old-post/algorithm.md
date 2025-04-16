---
title: 算法学习笔记
description: '有半年时间没有练算法了，近期忙完以后会继续学习与记录。'
published: 2023-04-16 00:33:43
category: 开发
tags: ["算法"]
---

工作后就停更啦！

# 入门

***

## 循环结构

### [P1307数组反转](https://www.luogu.com.cn/problem/P1307)

#### 如何将数字逐位剥离

```c++
while (n != 0)
{
    int t = n % 10;
    n /= 10;
}
```

#### 如何求解

```c++
int ans = 0;
ans = 10 * ans + t;
```

***

### 随机数

计算机通过确定的算法生成“伪随机数”，因此每次执行随机数算法前都要“喂给它”不同的初始值(srand()函数)作为随机数种子，这样才能生成不同的随机数。喂给它当前的时间就是一个比较好的选择，当然也可以把部分输入数据作为随机数种子。

```cpp
int ans;
srand(time(0)); // 以当前时间作为随机数种子
ans = rand() % 100 + 1; // 定义变量ans是一个1~100的随机数
```

*`rand() % a` 看起来能产生一个 0 到 a - 1 的随机数，但是每个数字并不是等可能的。假设 `RAND_MAX` 是 32767 ，取 0 ~ 99 的随机数时，抽到 0 ~ 67 的可能要比剩下的数字大一点。如果 `RAND_MAX` 远大于 a 时，影响并不大。*

***

### 质数口袋

[P5723 【深基4.例13】质数口袋 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P5723)

如何判断质数：如果一个大于1的整数仅能被1和自身整除，它就是一个质数，否则就是合数（1既不是质数也不是合数）。

```cpp
#include <iostream>
using namespace std;

int main()
{
    int L;
    cin >> L;
    int i = 2, weight = 0, count = 0;
    // 从2开始
    for (int i = 2;; i++)
    {
        bool flag = true; // 质数标识
        for (int j = 2; j * j <= i; j++)
            if (i % j == 0)
            {
                flag = false; // i可以被j整除，i不是质数，标识改变
                break;        // 退出j的for循环
            }
        if (flag == false)
            continue; // 如果不是质数，i++，进入while的下一循环
        if (i + weight > L)
            break; // 如果超重了，直接退出循环
        cout << i << endl;
        count++;
        weight += i;
    }
    cout << count << endl;
    return 0;
}
```

***

### 质因数分解

[P1075 [NOIP2012 普及组] 质因数分解 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P1075)

想复杂了，只要找出 n 的最小约数，再用 n 除以这个数，就能得到结果。*~~其实这是一道数学题~~*

*一个数能且只能分解为一组质数的乘积。*

```cpp
#include <iostream>
using namespace std;

int main()
{
    long long n;
    cin >> n;
    for (int i = 2; i <= n; i++)
        if (n % i == 0)
        {
            cout << n / i;
            break;
        }
    return 0;
}
```

***



## 其他

***

### 常见的输入输出占位符

| 占位符 |                          说明                          |
| :----: | :----------------------------------------------------: |
|   %d   |                     一个十进制整数                     |
|  %nd   | 输出一个整数，如果不足 n 位，前面用空格补齐直到够 n 位 |
|  %.nf  |              输出一个固定n位小数的浮点数               |
|  %0nd  | 输出一个整数，如果不足 n 位，前面用 0 补齐知道够 n 位  |
|   %c   |                  一个 char 类型的字符                  |
|   %s   |                       一个字符串                       |

***

### 关于浮点数精度误差

一种解决方式是先乘以 10^n 让其不触及浮点数，最后将其结果除回来。

### 数学函数

|                   函数原型                    |                 说明                  |
| :-------------------------------------------: | :-----------------------------------: |
| double sin(double x)     double cos(double x) |      三角函数正弦和余弦，x是弧度      |
|             double exp(double x)              |     返回$$e^x$$，其中e是自然常熟      |
|        double pow(double x, double y)         |  返回$$x^y$$，也可以用来运算多次根式  |
|             double sqrt(double x)             |           返回$$\sqrt{x}$$            |
|             double ceil(double x)             | 返回大于或等于x的最小的整数值(上取整) |

