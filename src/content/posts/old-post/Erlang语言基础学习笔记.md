---
title: Erlang语言基础学习笔记
description: '在某游戏公司岗前培训（其实就是自学）期间的学习笔记，Erlang是一个函数式编程语言，一般用于高并发情况下，初上手时不适应，但熟悉一天后写起来还蛮有意思的。'
published: 2024-01-17 16:33:26
category: 开发
tags: ["Erlang"]
---

# Erlang语言基础学习笔记

## 常用的一些语法

### API类（及其实现）

```erlang
%%%-------------------------------------------------------------------
%%% lists:max()
max([H|T]) -> max(T, H).
max([H|T], Max) when H > Max -> max(T, H);
max([_|T], Max)              -> max(T, Max);
max([],    Max)              -> Max.
%%%-------------------------------------------------------------------
%%% lists:min()
min([H|T]) -> min(T, H).
min([H|T], Min) when H < Min -> min(T, H);
min([_|T], Min)              -> min(T, Min);
min([],    Min)              -> Min. 
%%%-------------------------------------------------------------------
%%% lists:sum()
sum(L)          -> sum(L, 0).
sum([H|T], Sum) -> sum(T, Sum + H);
sum([], Sum)    -> Sum.
%%%-------------------------------------------------------------------
%%% lists:reverse()
reverse(List) ->
    reverse(List, []).
reverse([], Acc) ->
    Acc;
reverse([Head | Tail], Acc) ->
    reverse(Tail, [Head | Acc]).
%%%-------------------------------------------------------------------
%%% lists:member(Elem, List) 存在返回true,不存在返回false
member(_, []) -> false;
member(Element, [Element | _]) -> true;
member(Element, [_ | Tail]) -> member(Element, Tail).
%%%-------------------------------------------------------------------
%%% ++
concatenate_lists(List1, List2) ->
    case List1 of
        [] ->
            List2;
        [Head | Tail] ->
            [Head | concatenate_lists(Tail, List2)]
    end.
%%%-------------------------------------------------------------------
```

### 算术表达式

| 操作符  | 描述               | 参数类型 |
| ------- | ------------------ | -------- |
| + X     | + X                | 数字     |
| - X     | - X                | 数字     |
| X * Y   | X * Y              | 数字     |
| X / Y   | X / Y （浮点除法） | 数字     |
| X div Y | X被Y整除           | 整数     |
| X rem Y | X除以Y的整数余数   | 整数     |

## 练习题总结

### 元组，列表相关练习题

#### 遍历方式与累加器

对于列表的遍历，用尾递归，结合累加器，进行数据存储，示例：

```erlang
test([H | T], Acc) ->
	test(T, [H | Acc]).
```

其中，H是列表的头元素，T是H以后的列表，`[H | Acc]`为通过头插的形式把H插入到Acc头部。

#### 终止遍历条件

要终止对列表的遍历非常简单：

```erlang
test([], Acc) ->
    Acc;
%% 以下为遍历
test([H | T], Acc) ->
	test(T, [H | Acc]).
```

这里的意思是，当传入的第一个参数，列表为空时，输出Acc。

#### 简化调用API

继续上面，我们的累加器是自己设置的，实际用户调用的时候不需要设置Acc，所有调用接口可以简化：

```erlang
-export([test/1]).

test(List) ->
    test(List, []).

test([], Acc) ->
    lists:reverse(Acc);
%% 以下为遍历
test([H | T], Acc) ->
	test(T, [H | Acc]).
```

一个简单的遍历列表并把每个元素加到累加器中的功能就写好了，如果需要的话可以用`lists:reverse()`将Acc进行反转。

#### 索引的控制

一般情况下，在调用函数的时候就进行索引的比较与控制：

```erlang
$$$ 计算数字列表或元组索引N到M的和

%% API
-export([get_sum/3]).

get_sum(List, N, M) ->
    get_sum(List, N, M, 1, []).

get_sum([], _, _, _, Acc) ->
    lists:sum(Acc);
get_sum([H | T], N, M, Index, Acc) when (Index =< M) and (Index >= N)->
    get_sum(T, N, M, Index + 1, [H | Acc]);
get_sum([_ | T], N, M, Index, Acc) ->
    get_sum(T, N, M, Index + 1, Acc).
```

其中，我们在调用`get_sum`函数的时候，就对要传入其中的`Index`参数进行了控制，并用关卡机制对`Index`进行了检查，使其能够完成题目的要求。

关于索引控制的经典例题：

```erlang
%%% 替换元组或列表中指定位置的元素，新元素作为参数和列表或元组一起传入函数内

%% API
-export([replaceIdx/3]).

replaceIdx(List, Index, Val) ->
    replaceIdx(List, Index, Val, 1, []).

%% 列表空后反转累加器。
replaceIdx([], _, _, _, Acc) ->
    lists:reverse(Acc);

%% 到达替换位置的处理：把Val放到累计器的头部
replaceIdx([_ | Rest], Index, Val, Index, Acc) ->
%%    io:format("[~p]~n", [[Val | Acc]]),
    replaceIdx(Rest, Index, Val, Index + 1, [Val | Acc]);

%% 未到达指定位置：把头元素放到累加器的头部。
replaceIdx([Element | Rest], Index, Val, CurrentIndex, Acc) ->
%%    io:format("[~p]~n", [[Element | Acc]]),
    replaceIdx(Rest, Index, Val, CurrentIndex + 1, [Element | Acc]).
```

#### case与if表达式

```erlang
%%% 对数字列表中的奇数进行求和，后除以3的商得值为A，并将偶数求和后除以3的余数得值为B，然后求A+B结果，输出A、B、A+B

%% API
-export([get_res/1]).

%% 求和
get_sum([]) -> 0;
get_sum([H | T]) -> H + get_sum(T).

%% 求偶数和
get_even_sum([], Acc) -> Acc;
get_even_sum([H | T], Acc) ->
    %% 这里的case用来做一种类似if的判断，如果`H rem 2 = 0`说明是偶数，就把H加到累加器中。
    case H rem 2 of
        0 -> get_even_sum(T, Acc + H);
        _ -> get_even_sum(T, Acc)
    end.

%% 求值
get_res([H | T]) ->
    A = get_sum([H | T]) div 3,
    B = q5:get_even_sum([H | T], 0) rem 3,
    {A, B, A + B}.
```

```erlang
%%% 查找元素在元组或列表中的位置

%% API
-export([get_index/3]).

get_index([], _, _) -> 0; %% 不会用到的参数用_传入即可。
get_index([H | T], N, Index) when (Index =< T) ->
    if
        (H == N) ->
            Index;
        true ->
            get_index(T, N, Index + 1)
    end.
```

```erlang
%%% 移除元组或列表中指定位置的元素

%% API
-export([remove/2]).

remove(List, Position) ->
    case Position of
        1 ->
            [H | T] = List,
            T;
        N when N > 1 ->
            [H | T] = List,
            [H | remove(T, N - 1)]
    end.
```

#### 列表推导

[ F(X) || X <- L]标记的意思是“由F(X)组成的列表（X从列表L中提取）”。

```erlang
%%% 对数字列表或元组，输出所有偶数乘以它在此列表或元组中的偶数位数

%% API
-export([evens_mul/1]).

evens_mul(List) ->
    Even = evens(List, [], 1),
    [H * Idx || {H, Idx} <- Even].

evens([], Even, _) ->
    Even;
%% 先拿到偶数与坐标
evens([H | T], Even, Idx) ->
    if
        H rem 2 == 0 ->
            evens(T, [{H, Idx} | Even], Idx + 1);
        true ->
            evens(T, Even, Idx)
    end.
```

#### 冒泡排序

```erlang
%%% 使用冒泡排序对列表进行排序

%% API
-export([bubble_sort/1]).

%% 取列表头作为最大值和
bubble_sort(List) ->
    bubble_sort(List, length(List)).

bubble_sort(List, 0) -> List; % 当迭代次数为 0 时，排序完成
bubble_sort(List, N) ->
    SortedList = bubble_pass(List, N), % 对列表进行下一趟冒泡,一个元素到达最终位置
    bubble_sort(SortedList, N - 1). % 递归的进行下一趟冒泡

bubble_pass([X, Y | Rest], N) when X > Y ->
    [Y | bubble_pass([X | Rest], N - 1)]; % 如果 X > Y 就交换他们
bubble_pass([X | Rest], N) ->
    [X | bubble_pass(Rest, N - 1)]; % 否则位置保持不变
bubble_pass([], _) -> [].
```

#### 列表更方便的匹配方式

```erlang
%%% 对一个字符串按指定符字劈分

%% API
-export([split/2]).

split(String, [C | _]) ->
    split_head(String, C, []).
split_tail([], _, RAcc) ->
    lists:reverse(RAcc);
split_tail([H | T], Seps, RAcc) ->
    split_tail(T, Seps, [H | RAcc]).
split_head([Seps | T], Seps, FAcc) ->
    [lists:reverse(FAcc), split_tail(T, Seps, [])];
split_head([H | T], Seps, FAcc) ->
    split_head(T, Seps, [H | FAcc]).
```

其中`split_head([Seps | T], Seps, FAcc)`为在传参，条件判断的时候就进行了匹配，更方便好用。

#### 列表的链式反应

```erlang
%%% 对相同类型的数据进行拼接

%% API
-export([merge_lists/2, merge_tuples/2, merge_binary/2]).

%% 列表拼接
merge_lists([], List2) -> List2;
merge_lists([Head | Tail], List2) ->
    [Head | merge_lists(Tail, List2)].

%% 元组拼接
merge_tuples(Tuple1, Tuple2) ->
    TupleList1 = tuple_to_list(Tuple1),
    TupleList2 = tuple_to_list(Tuple2),
    Tuples = merge_lists(TupleList1, TupleList2),
    list_to_tuple(Tuples).

%% 二进制拼接
merge_binary(Binary1, Binary2) ->
    BinaryList1 = binary_to_list(Binary1),
    BinaryList2 = binary_to_list(Binary2),
    BinaryList = merge_lists(BinaryList1, BinaryList2),
    list_to_binary(BinaryList).

```

`[Head | merge_lists(Tail, List2)]`为链式反应，不断把每次递归的头结点依次塞到该列表内。

### 字符串相关练习题

#### 回文题

```erlang
%%% 检查一个字符串是否是回文

%% API
-export([check/1]).

check(String) ->
    Middle = (length(String) div 2) + (length(String) rem 2),
    split_string(String, Middle, 1, []).
split_string([_ | T], Index, Index, Acc) ->
    check_equal(lists:reverse(Acc), split_string_right(T, []));
split_string([H | T], Index, CIndex, Acc) ->
    split_string(T, Index, CIndex + 1, [H | Acc]).
split_string_right([], Acc) ->
    Acc;
split_string_right([H | T], Acc) ->
    split_string_right(T, [H | Acc]).
check_equal(List, List) ->
    true;
check_equal(_, _) ->
    false.
```

#### 多层嵌套

```erlang
%%% 查找一个字符串中的最长单词

%% API
-export([check_max_length/1]).

%% 经过测试，空格是32
check_max_length(String) ->
    check_max_length(String, 32, 0, 0).
check_max_length([], _, Length, Max) ->
    check_max(Length, Max);
check_max_length([Seps | T], Seps, Length, Max) ->
    check_max_length(T, Seps, 0, check_max(Length, Max));
check_max_length([_ | T], Seps, Length, Max) ->
    check_max_length(T, Seps, Length + 1, Max).
check_max(Length1, Length2) ->
    if
        Length1 > Length2 ->
            Length1;
        true ->
            Length2
    end.
```

