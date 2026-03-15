---
title: 阿里云大模型工程师ACP学习笔记
published: 2026-03-15
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
comments: true
---

## 一、基础对话调用

### 1.1 核心代码实现

```python
from openai import OpenAI
import os
client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)
def get_qwen_response(prompt):
    response = client.chat.completions.create(
        model="qwen-max",
        messages=[
            # system message 用于设置大模型的角色和任务
            {"role": "system", "content": "你负责教育内容开发公司的答疑，你的名字叫公司小蜜，你要回答同事们的问题。"},
            # user message 用于输入用户的问题
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
response = get_qwen_response("我们公司项目管理应该用什么工具")
print(response)
```

### 1.2 消息类型说明

| 角色 | 作用 |
|------|------|
| `system` | 设置大模型的角色和任务 |
| `user` | 用户输入的问题 |
| `assistant` | 模型回复 |

---

## 二、多轮对话

### 2.1 核心概念

多轮对话让大模型能够"记住"历史对话信息，理解上下文关联，从而给出连贯、准确的回复。

### 2.2 实现原理

在 `messages` 参数中保存完整的对话历史记录，每条消息包含 `role` 和 `content` 字段。大模型会根据所有历史消息来生成回复。

```python
def multi_turn_chat():
    # 初始化对话历史，包含系统提示词
    conversation_history = [
        {"role": "system", "content": "你负责教育内容开发公司的答疑，你的名字叫公司小蜜，你要回答同事们的问题。"}
    ]
    
    # 模拟多轮对话
    user_questions = [
        "我们公司项目管理应该用什么工具？",
        "那我怎么申请这个工具的账号呢？",
        "申请一般需要多久能批下来？"
    ]
    
    for question in user_questions:
        print(f"👤 用户：{question}")
        
        # 将用户问题添加到对话历史
        conversation_history.append({"role": "user", "content": question})
        
        # 调用大模型，传入完整的对话历史
        response = client.chat.completions.create(
            model="qwen-max",
            messages=conversation_history  # 包含所有历史消息
        )
        
        # 获取模型回复
        assistant_message = response.choices[0].message.content
        print(f"🤖 小蜜：{assistant_message}\n")
        
        # 将模型回复也添加到对话历史，以便下一轮对话使用
        conversation_history.append({"role": "assistant", "content": assistant_message})

multi_turn_chat()
```

---

## 三、流式输出

### 3.1 为什么需要流式输出？

默认情况下，API 需要等待模型生成完所有内容后才一次性返回结果（约20秒），影响用户体验。流式输出让模型一边思考一边输出，用户能立即看到部分回复。

### 3.2 实现方式

```python
def get_qwen_stream_response(user_prompt,system_prompt):
    response = client.chat.completions.create(
        model="qwen-max",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        stream=True
    )
    for chunk in response:
        yield chunk.choices[0].delta.content

response = get_qwen_stream_response(user_prompt="我们公司项目管理应该用什么工具",system_prompt="你负责教育内容开发公司的答疑，你的名字叫公司小蜜，你要回答同事们的问题。")
for chunk in response:
    print(chunk, end="")
```

> 💡 **提示**：流式输出只是改变展示方式，模型思考过程和答案质量保持不变。

---

## 四、大模型文本生成工作流程

### 4.1 流程概览

```
文本分词 → Token向量化 → 大模型推理 → 解码与自回归 → 输出文本
```

### 4.2 详细阶段

#### 第一阶段：文本分词（Tokenization）

计算机无法直接理解人类文字，需要将文本转换为 Token（分词）序列。每个 Token 对应词表中的一个整数 ID。

- Token 通常是子词片段或字符片段，不一定等于完整词语
- 英文可能被拆成词根和后缀，中文可能按字或词组切分

#### 第二阶段：Token 向量化

将离散 ID 转换为包含语义信息的向量表示。通过 Embedding 矩阵"查表"获取每个 token 的语义向量。

还需添加位置信息（Positional Encoding），让模型区分词语顺序。

#### 第三阶段：大模型推理

向量序列进入 Transformer 解码器层，通过因果自注意力机制和前馈神经网络进行处理。最终得到最后一个 token 的隐藏状态向量，通过线性投影层映射到词汇表维度得到 Logits。

#### 第四阶段：解码与自回归

- **Softmax**：将 logits 转换为概率分布 P(next_token | context)
- **解码策略**：
  - 近似确定性：贪心解码、Beam Search
  - 随机采样：Top-p（Nucleus Sampling）、Top-k Sampling

- **自回归生成**：将新 token 追加到输入序列，重复预测下一个 token，直到满足停止条件：
  - 生成 EOS 终止符
  - 达到最大生成长度
  - 生成用户指定的停用词

#### 第五阶段：输出文本

将 token ID 序列转换回人类可读的字符串。

---

## 五、影响生成随机性的参数

### 5.1 temperature（温度）

调节候选 Token 的概率分布，影响生成文本的多样性和创造性。

| 场景 | 建议值 |
|------|--------|
| 需要明确答案（代码生成） | 较低 |
| 需要创意多样（广告文案） | 较高 |
| 无特殊需求 | 默认值 |

> ⚠️ 当 temperature=0 时，虽降低随机性，但无法保证每次输出完全一致。

### 5.2 top_p（核采样）

按概率从高到低排序，选取累计概率达到设定阈值的 Token 组成候选集合。

| 值 | 效果 |
|----|------|
| 较大 | 候选范围广，内容更多样（创意写作） |
| 较小 | 候选范围窄，输出更稳定（新闻、代码） |

### 5.3 小结

- 建议不同时调整 `temperature` 和 `top_p`，以确保输出可控
- 即使设置 temperature=0、top_p=极小值、seed相同，仍可能存在微小随机性（分布式系统等因素导致）

---

## 六、私域知识问答

### 6.1 问题根源

大模型的知识来源于训练数据（公开互联网信息），无法直接回答公司内部文档、政策等私域问题。

### 6.2 初步方案：提示词中"喂"入知识

直接塞入背景知识可解决问题，但存在**核心瓶颈**：

- **上下文窗口有限**：无法一次性塞入大量文档
- **效率低**：上下文越长，处理时间越长
- **成本高**：按文本量计费
- **信息干扰**：无关信息会影响回答质量

### 6.3 解决之道：上下文工程（Context Engineering）

在正确的时间，将最相关、最精准的知识动态加载到有限的上下文窗口中。

**核心技术包括**：

| 技术 | 作用 |
|------|------|
| **RAG** | 从外部知识库检索信息 |
| **Prompt** | 精心设计指令引导模型 |
| **Tool** | 调用外部工具获取实时信息 |
| **Memory** | 建立长短期记忆机制 |

---

## 七、RAG（检索增强生成）

### 7.1 核心思想

不再将全部知识库硬塞给大模型，而是**先检索、后生成**：
1. 自动检索与问题最相关的私有知识片段
2. 将片段与用户问题合并后传给大模型
3. 生成最终答案

### 7.2 实现阶段

#### 第一阶段：建立索引

1. 将私有知识文档分割为片段
2. 使用 Embedding 模型将文本转化为向量
3. 存储到向量数据库，保留语义信息

#### 第二阶段：检索与生成

1. 用户提问时，将问题转化为向量
2. 在向量数据库中检索相似片段
3. 将相关片段与问题一同输入大模型
4. 生成最终回答

### 7.3 RAG 优势

- ✅ 避免上下文过长导致的问题
- ✅ 提高输出准确性与相关性
- ✅ 降低使用成本
- ✅ 支持大规模知识库

---

## 知识脉络图

```
大模型基础调用
    ├── 单轮对话
    ├── 多轮对话（记忆上下文）
    └── 流式输出（用户体验优化）

    ↓
    
大模型工作原理
    ├── 文本分词 → Token向量化
    ├── Transformer推理
    ├── 解码策略（贪心/采样）
    └── 自回归生成

    ↓
    
参数控制
    ├── temperature（多样性）
    ├── top_p（候选范围）
    └── seed（可复现性）

    ↓
    
私域知识问答
    └── 上下文工程
        ├── RAG（检索增强生成）
        ├── Prompt工程
        ├── 工具使用
        └── 记忆机制
```

---

> **学习心得**：成功的关键不在于"喂"给模型多少知识，而在于"喂"得有多准。上下文工程正是释放大模型潜力的关键所在。
