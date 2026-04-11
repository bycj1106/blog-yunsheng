---
title: RAG笔记
published: 2026-03-23
description: 深入解析RAG检索增强生成技术：核心概念、流程详解与生产环境优化
image: ''
tags: ['RAG', 'LLM', '向量数据库', '检索增强生成', 'AI']
category: AI技术
draft: true
lang: zh-CN
comments: true
---

## 为什么需要RAG

大型语言模型（LLM）虽然在自然语言处理领域表现出色，但存在固有的局限性：

### LLM 的固有缺陷

1. **知识截止日期限制**：模型的知识来自训练数据，存在时间边界，无法及时获取最新信息。

2. **幻觉问题（Hallucination）**：模型可能生成看似合理但实际错误的内容，这在需要高准确性的场景中是不可接受的。

3. **缺乏领域专业知识**：通用模型在垂直领域（如医疗、法律、金融）的专业问答上表现不足。

4. **无法访问私有数据**：企业的内部文档、业务数据无法被模型利用。

### RAG 的核心价值

RAG（Retrieval-Augmented Generation，检索增强生成）通过将外部知识检索与 LLM 生成能力相结合，有效解决了上述问题：

- **实时知识更新**：通过检索最新文档，确保回答包含最新信息
- **减少幻觉**：基于检索到的真实内容生成答案，提高准确性
- **领域适配**：可接入任何领域的专业文档，构建垂直知识库
- **数据安全**：私有数据可本地部署，无需上传到第三方

> RAG 的概念最早由 Facebook AI Research（现 Meta）在 2020 年提出（参考：[《Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks》](https://arxiv.org/abs/2005.11401)，Lewis et al., 2020））。

## 核心概念科普

### 向量检索（Vector Retrieval）

向量检索是 RAG 的技术基础。其核心思想是将文本映射到高维向量空间，通过计算向量间的相似度来实现语义匹配。

**主要相似度度量方式**：
- **余弦相似度（Cosine Similarity）**：衡量两个向量方向的相似程度，值域为 [-1, 1]
- **欧氏距离（Euclidean Distance）**：衡量向量在空间中的绝对距离
- **点积（Dot Product）**：计算向量方向的一致性

**常用向量数据库**：
- **Milvus**：开源分布式向量数据库，支持十亿级向量检索
- **Pinecone**：云原生向量数据库服务
- **Weaviate**：开源向量搜索引擎
- **Chroma**：轻量级向量数据库，适合快速原型开发
- **FAISS**：Facebook 开源的高效向量检索库

### Embedding（文本向量化）

Embedding 是将文本转换为稠密向量的技术。好的 Embedding 模型能够捕捉文本的语义信息。

**主流 Embedding 模型**：

| 模型 | 维度 | 特点 |
|------|------|------|
| **text-embedding-ada-002** | 1536 | OpenAI 提供，稳定可靠 |
| **text-embedding-3-small/large** | 可扩展 | OpenAI 最新版本，支持维度裁剪 |
| **BGE（BAAI General Embedding）** | 1024 | 国产优秀模型，支持中英文 |
| **M3E（Moka Massive Mixed Embedding）** | 768 | 专为中文优化 |

> 参考：[OpenAI Embeddings 官方文档](https://platform.openai.com/docs/guides/embeddings)

### Chunking（文本分块）

将长文档切分成适合检索的小单元，是影响 RAG 效果的关键环节。

**分块策略**：

1. **固定长度分块**
   - 按字符数或 token 数固定切分
   - 优点：实现简单
   - 缺点：可能破坏语义完整性

2. **句子级别分块（Sentence Splitting）**
   - 按句子边界切分
   - 优点：保留完整语义
   - 缺点：块可能过短，信息量不足

3. **段落级别分块（Paragraph Splitting）**
   - 按自然段落切分
   - 优点：语义相对完整
   - 缺点：段落长度不均

4. **递归分块（Recursive Chunking）**
   - 先按段落，再按句子递归切分
   - 优点：平衡语义完整性和块大小

5. **语义分块（Semantic Chunking）**
   - 使用 Embedding 判断语义边界
   - 优点：语义内聚度高
   - 缺点：实现复杂

6. **结构分块（Structure-aware Chunking）**
   - 利用文档结构（标题、列表、表格）辅助切分
   - 优点：保持结构信息

7. **Agentic Chunking**
   - 使用 LLM 自主判断分块边界
   - 优点：最符合语义
   - 缺点：成本较高

**分块参数建议**：
- **块大小（Chunk Size）**：通常 500-1000 tokens
- **重叠（Overlap）**：建议 10-20% 的重叠，保证上下文连续性
- **块太小**：丢失上下文信息，检索精度下降
- **块太大**：引入噪声，降低相关性

> 参考：[RAG 文本分块：七种主流策略](https://mp.weixin.qq.com/s/xxxx)

### 检索增强生成（Retrieval-Augmented Generation）

RAG 的核心工作流程：
1. **索引构建**：将文档切分、向量化后存入向量数据库
2. **检索阶段**：用户查询向量化后，在向量库中检索相关文档块
3. **生成阶段**：将检索结果作为上下文，由 LLM 生成最终回答

## RAG流程详解

### 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        索引构建阶段                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ 文档加载 │ -> │ 文档解析  │ -> │  文本分块 │ -> │ 向量化   │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│                                                    ↓             │
│                                         ┌──────────────┐        │
│                                         │  向量数据库   │        │
│                                         │   (索引存储)  │        │
│                                         └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        查询生成阶段                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ 用户查询 │ -> │ 查询改写  │ -> │  向量化   │ -> │  检索    │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│                                                    ↓             │
│                                         ┌──────────────┐        │
│                                         │  文档块召回   │        │
│                                         └──────────────┘        │
│                                                    ↓             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │ 最终回答 │ <- │  LLM生成  │ <- │ 上下文组装│                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 阶段一：数据处理与索引构建

#### 1. 文档加载（Document Loading）

支持多种格式的文档：
- **纯文本**（.txt, .md）
- **PDF**（需要解析文本内容）
- **Word 文档**（.docx）
- **HTML**
- **结构化数据**（CSV, JSON）
- **数据库**（通过 SQL 查询）

#### 2. 文档解析（Document Parsing）

关键技术：
- **PDF 解析**：使用 PyMuPDF、pdfplumber 等库提取文本
- **表格识别**：识别并处理表格结构
- **图片 OCR**：对扫描文档进行光学字符识别

#### 3. 文本分块（Text Chunking）

如「核心概念科普」章节所述，采用适当的分块策略。

#### 4. 向量化与索引存储

```python
# 典型的向量化流程
from sentence_transformers import SentenceTransformer

# 加载 Embedding 模型
model = SentenceTransformer('BAAI/bge-large-zh-v1.5')

# 生成向量
embeddings = model.encode(documents)

# 存储到向量数据库
vector_store.add_vectors(embeddings, documents)
```

### 阶段二：查询与检索

#### 1. 查询改写（Query Rewriting）

用户输入可能存在以下问题，需要改写优化：
- **表达不完整**：口语化、不清晰
- **歧义性**：存在多种理解
- **专业术语缺失**：缺少领域关键词

常用改写技术：
- **Query Expansion**：扩展查询同义词、近义词
- **Query Decomposition**：分解复杂查询为子查询
- **HyDE（Hypothetical Document Embeddings）**：让 LLM 生成假设性答案，用答案来检索
- **Step-back Prompting**：抽象化问题，检索更通用信息

> 参考：[HyDE 论文](https://arxiv.org/abs/2212.10496)

#### 2. 向量检索

**检索方式**：

| 检索方式 | 描述 | 适用场景 |
|---------|------|---------|
| **稀疏检索（Sparse Retrieval）** | BM25、TF-IDF，基于词频统计 | 关键词明确 |
| **稠密检索（Dense Retrieval）** | 基于 Embedding 向量相似度 | 语义理解需求 |
| **混合检索（Hybrid Retrieval）** | 稀疏 + 稠密融合 | 通用场景 |
| **重排序（Reranking）** | 先召回后精排 | 需要高精度的场景 |

**Top-K 召回策略**：
- 设定检索返回的相关文档数量
- 建议 K 值：3-10，根据块大小调整
- 可结合余弦相似度阈值过滤低相关结果

#### 3. 上下文组装（Context Assembly）

将检索到的文档块组装成 LLM 的输入上下文：

```python
# 典型的 Prompt 组装
def assemble_context(query, retrieved_docs):
    context = "请基于以下参考资料回答问题：\n\n"
    for i, doc in enumerate(retrieved_docs, 1):
        context += f"[参考{i}]: {doc.content}\n\n"
    context += f"问题：{query}"
    return context
```

**关键参数**：
- **上下文长度限制**：考虑 LLM 的上下文窗口大小
- **块排序**：按相关性或文档顺序排列
- **元数据保留**：保留来源、时间等参考信息

### 阶段三：生成与后处理

#### 1. LLM 生成

```python
# 典型的 RAG 生成调用
response = llm.chat([
    {"role": "system", "content": "你是一个知识库问答助手。"},
    {"role": "user", "content": assemble_context(query, retrieved_docs)}
])
```

#### 2. 后处理

- **答案验证**：检查答案是否基于检索内容
- **溯源标注**：标注参考来源
- **置信度评估**：评估回答的可信程度
- **过滤重复**：去除冗余信息

## 生产环境优化细节

### 一、检索优化

#### 1. 混合检索策略

结合稀疏检索和稠密检索的优势：

```python
# 混合检索实现示例
def hybrid_search(query, top_k=5, alpha=0.7):
    # alpha 控制稀疏和稠密权重
    sparse_results = bm25_retriever.search(query, top_k)
    dense_results = vector_retriever.search(query, top_k)

    # RRF（Reciprocal Rank Fusion）融合
    fused_results = rrf_fusion(sparse_results, dense_results, alpha)
    return fused_results
```

> 参考：[Sparse Dense Retrieval](https://arxiv.org/abs/2004.14272)

#### 2. 重排序（Reranking）

使用更强大的模型对初步召回结果进行精排：

| 模型 | 特点 |
|------|------|
| **Cohere Rerank** | 云服务，易用性好 |
| **BGE Reranker** | 开源，支持本地部署 |
| **LLM Rerank** | 使用 LLM 进行重排，精度高但成本高 |

```python
# 两阶段检索
# 第一阶段：快速召回
initial_results = vector_retriever.search(query, top_k=20)

# 第二阶段：精排
reranked_results = reranker.rerank(query, initial_results, top_n=5)
```

#### 3. 检索参数调优

| 参数 | 说明 | 建议值 |
|------|------|--------|
| **Top-K** | 召回数量 | 3-10 |
| **Similarity Threshold** | 相似度阈值 | 0.5-0.8 |
| **Max Distance** | 最大距离阈值 | 根据数据分布调整 |

### 二、分块策略优化

#### 1. 自适应分块

根据文档类型选择分块策略：

```python
def smart_chunking(document):
    doc_type = detect_document_type(document)

    if doc_type == "technical_report":
        return semantic_chunking(document)  # 技术报告使用语义分块
    elif doc_type == "conversation":
        return conversation_chunking(document)  # 对话使用对话分块
    elif doc_type == "qa_pairs":
        return qa_chunking(document)  # 问答对保持完整
    else:
        return recursive_chunking(document)  # 默认递归分块
```

#### 2. 块元数据增强

添加丰富的元数据提升检索效果：

```python
class EnhancedChunk:
    content: str
    metadata = {
        "source": "document_name.pdf",
        "page": 5,
        "heading": "第二章 基础知识",
        "chunk_index": 3,
        "created_at": "2024-01-01",
        "keywords": ["RAG", "向量检索", "Embedding"]
    }
```

### 三、Embedding 模型优化

#### 1. 模型选择

| 场景 | 推荐模型 | 说明 |
|------|---------|------|
| 通用英文 | text-embedding-3-large | OpenAI 最新高性能模型 |
| 通用中文 | BGE-large-zh | 国产优秀模型 |
| 多语言 | multilingual-e5 | 支持 100+ 语言 |
| 代码检索 | codex-embeddings | OpenAI 专用代码模型 |

#### 2. 微调 Embedding

针对特定领域，微调 Embedding 模型可显著提升效果：

> 参考：[Sentence Transformers 微调指南](https://www.sbert.net/docs/training/overview.html)

### 四、查询优化

#### 1. 多跳推理查询

处理复杂问题，将问题分解为多个子查询：

```python
def multi_hop_query(question):
    # LLM 生成子问题
    sub_questions = decompose_question(question)

    # 并行执行子查询
    sub_results = [retrieve(q) for q in sub_questions]

    # 合并结果生成答案
    answer = synthesize(sub_results, question)
    return answer
```

#### 2. 查询路由

根据查询类型路由到不同的处理管道：

| 查询类型 | 处理策略 |
|---------|---------|
| 事实性问题 | 直接检索 + 简答生成 |
| 分析性问题 | 多文档对比 + 分析生成 |
| 总结性问题 | 大范围检索 + 总结生成 |
| 闲聊 | 减少检索权重，增加对话连贯性 |

### 五、LLM 与 Prompt 优化

#### 1. Prompt 工程

```python
SYSTEM_PROMPT = """你是一个专业的知识库问答助手。
请遵循以下规则：
1. 只基于提供的参考资料回答问题
2. 如果资料不足以回答，请明确说明
3. 回答时标注参考来源
4. 保持回答的准确性和客观性
"""

USER_PROMPT = """参考资料：
{context}

问题：{question}

请基于以上资料回答问题。
"""
```

#### 2. 上下文压缩

对检索到的长文档进行压缩，减少 token 消耗：

> 参考：[RECOMP 论文](https://arxiv.org/abs/2310.04408)

### 六、评估与监控

#### 1. 检索评估指标

| 指标 | 说明 |
|------|------|
| **Hit Rate** | 命中率，前 K 个结果中包含正确答案的比例 |
| **MRR（Mean Reciprocal Rank）** | 平均倒数排名 |
| **NDCG** | 归一化折损累计增益 |

#### 2. 生成评估指标

| 指标 | 说明 |
|------|------|
| **RAGAS** | RAG 专用评估框架 |
| **Faithfulness** | 答案对参考资料的忠实度 |
| **Answer Relevancy** | 答案与问题的相关性 |

> 参考：[RAGAS 评估框架](https://docs.ragas.io/)

### 七、工程实践建议

1. **缓存策略**：缓存频繁访问的查询结果和 Embedding 结果

2. **异步处理**：索引构建采用异步批处理，提高吞吐量

3. **增量更新**：支持文档的增量添加和删除，无需全量重建索引

4. **监控告警**：监控检索召回率、响应延迟、错误率等关键指标

5. **A/B 测试**：对比不同分块策略、检索策略的效果

### 八、2025 年 RAG 技术趋势

根据行业观察，2025 年 RAG 技术的发展方向包括：

1. **推理增强（Reasoning-enhanced RAG）**：结合 Agent 能力，支持复杂推理
2. **记忆增强（Memory-augmented RAG）**：结合长期记忆，提升对话连贯性
3. **多模态 RAG（Multimodal RAG）**：支持图像、音频、视频等多种模态
4. **Context Engineering**：更精细的上下文管理，而非简单的检索增强

> 参考：[2025 年 RAG 技术年终总结](https://mp.weixin.qq.com/s/xxxx)

---

**参考资源**：
1. Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", arXiv 2020
2. Gao et al., "RAGAS: Automated Evaluation of Retrieval Augmented Generation", 2023
3. Khattab et al., "ColBERTv2: Efficient Passage Retrieval via Compositional Late Interaction", 2022
4. DeepRetrieval: [https://github.com/FlagOpen/FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding)
