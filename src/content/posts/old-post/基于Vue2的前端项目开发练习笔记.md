---
title: Vue2开发学习笔记
description: 'Vue2的一些学习笔记，包括安装、自定义组件、Vuex、Vue Router等内容。'
published: 2024-04-13 21:31:01
image: "https://wallhalla.com/wallpaper/21/variant/preview/lg"
category: 开发
tags: ["前端开发"]
---

好想直接学最新的 vue3……

最近听到一首挺好听的歌，《若月亮没来》。

## vue2 安装

vue2 的 CLI 与 vue3 的 CLI 有所不同，应参照[该文档](https://cli.vuejs.org/#getting-started)进行安装

**安装 Vue CLI**

```bash
npm install -g @vue/cli
# or
yarn global add @vue/cli
```

**创建项目**

```bash
vue create my-project
# or
vue ui
```

**启动项目**

```bash
npm run serve
```

## Vue 自定义组件

```vue
<!-- src\components\product-item\product-item.vue -->
<template>
  <div class="product-item">
    <img :src="products.img" alt="商品" />
    <div class="title">{{ products.title }}</div>
    <div class="price">
      <div class="current-price">{{ products.currentPrice }}</div>
      <div class="original-price">{{ products.originalPrice }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      products: {
        type: Object,
        default: () => ({
          img: "",
          title: "",
          currentPrice: "",
          originalPrice: "",
        }),
      },
    },
  };
</script>
```

```vue
<!-- src\App.vue -->
<template>
  <body>
    <div class="layout-default">
      <topNavigation />
      <div class="list">
        <Product
          v-for="(product, index) in products"
          :key="index"
          :products="product"
        ></Product>
      </div>
    </div>
  </body>
</template>

<script>
  import Product from "@/components/product-item/product-item.vue";
  import topNavigation from "@/components/top-navigation/top-navigation.vue";
  import { mapState } from "vuex";

  export default {
    components: {
      Product,
      topNavigation,
    },
    computed: {
      ...mapState({
        products: (state) => state.shop.products,
      }),
    },
  };
</script>
```

**slot**

在 Vue 中，`slot`是一种分发内容的机制，允许我们将组件的一部分内容插入到组件的模板中。这种方式使得我们可以编写可复用的组件，而不需要在每次使用时都写重复的内容。

例如，如果有一个自定义的`<my-button>`组件，我们可能想在不同的地方使用不同的文本。这就可以通过`slot`来实现：

```html
<!-- my-button组件的模板 -->
<button>
  <slot>默认按钮文本</slot>
</button>
```

使用这个组件时，可以这样做：

```html
<my-button> 点击我 </my-button>
```

这样`<my-button>`组件里的`<slot>`标签就会被替换为“点击我”，而不是默认的“默认按钮文本”。

`slot`还可以有名字，这样你就可以定义多个插槽，让父组件决定哪些内容放在哪里。例如：

```html
<!-- my-layout组件的模板 -->
<div>
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

在使用时：

```html
<my-layout>
  <template v-slot:header>
    <h1>这是标题</h1>
  </template>

  <p>这是主体内容</p>

  <template v-slot:footer>
    <p>这是页脚信息</p>
  </template>
</my-layout>
```

这样，`my-layout`组件就会在相应的位置显示“这是标题”、“这是主体内容”和“这是页脚信息”。

总之，`slot`是 Vue 中一种非常有用的特性，用于创建灵活且可复用的组件。

## [Vuex 的使用](https://v3.vuex.vuejs.org/zh/)

**使用常量存储静态数据**

```js
// src\constants\constants.js
import {
  productImageUrl1,
  productImageUrl2,
  productImageUrl3,
  productImageUrl4,
} from "@/constants/image";

export const SHOP_PRODUCTS_DATA = [
  {
    img: productImageUrl1,
    title: "AC/DC North American Tour T-shirt",
    currentPrice: "$25.90",
    originalPrice: "$37.50",
  },
  {
    img: productImageUrl2,
    title: "Brown Janis Joplin Printed HoodedLight Trailer  S...",
    currentPrice: "$19.90",
    originalPrice: "",
  },
];
```

_关于 image.js 的示例:_

```js
import productImage1 from "@/assets/img/image 1.png";
export const productImageUrl1 = productImage1;
```

**Vuex 的引入**

1. 创建 store 文件夹，在 store 文件夹下创建 module 文件夹和 index.js 文件，在 module 文件夹中创建 module.js 文件.
2. 在 module.js 文件中创建 state,mutations,actions,getters 对象。
3. 在 index.js 中创建 store 对象，在 main.js 中引入 store 对象，在 main.js 中挂载 store 对象

```js
// src\store\modules\shop.js
import { SHOP_PRODUCTS_DATA } from "@/constants/constants";

export default {
  state: {
    products: SHOP_PRODUCTS_DATA,
  },
};
```

```js
// src\store\index.js
import Vue from "vue";
import Vuex from "vuex";
import shopProducts from "@/store/modules/shop";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    shop: shopProducts,
  },
});
```

```js
// src\main.js
import Vue from "vue";
import App from "./App.vue";
import store from "@/store/index";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
```

**在主模块中引入 Vuex**

```vue
<script>
  import Product from "@/components/product-item/product-item.vue";
  import { mapState } from "vuex";

  export default {
    components: {
      Product,
    },
    computed: {
      ...mapState({
        products: (state) => state.shop.products,
      }),
    },
  };
</script>
```

## [vue-router 的使用](https://v3.router.vuejs.org/zh/)

### vue-router 安装

```bash
npm install vue-router@version
```

### vue-router 结构目录

- src
  - router
    - index.js

### 路由配置

```js
// src\router\index.js
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 路由规则
const routes = [
  {
    path: "/",
    component: () => import("../page/ShoppingList.vue"),
  },
  {
    path: "/PDP",
    component: () => import("../page/PDP.vue"),
  },
  {
    path: "/ShoppingCart",
    component: () => import("../page/ShoppingCart.vue"),
  },
  {
    path: "*",
    ridirect: "/",
  },
];

// 路由器
const router = new Router({
  routes,
  mode: "hash", // history
});

export default router;
```

_路由模式：如果需要去掉 URL 中的 "#" ，需要在创建 `VueRouter` 实例时设置 `mode` 为 `history` 。_

```js
// src\main.js
import router from "./router/index";

new Vue({
  router, // new
  render: (h) => h(App),
}).$mount("#app");
```

### 路由使用

对于动态导航，可以这样使用：

```vue
<!-- 在组件模板中 -->
<router-link to="/">Home</router-link>
<router-view>
</router-view>
```

或者在 JavaScript 中：

```js
this.$router.push("/");
```

_`router-link`内的属性值：_

```vue
<!-- replace 不保留历史记录 -->
<!-- tag 改变标签 -->
<!-- target 改变链接打开方式 -->
<router-link to="/" replace tag="div" target="_blank">Home</router-link>
```

### 路由传参

在本项目中，要实现跳转到 PDP 页面，需要将商品 ID 传过去。

_动态匹配路由跳转时路由规则的修改_

```js
const routes = [
  {
    path: "/pdp/:id",
    name: "pdp",
    component: () => import("../page/PDP.vue"),
  },
];
```

添加上 name 属性后，就可以在 `<router-link>` 中进行动态匹配了：

```vue
<router-link :to="{ name: 'pdp', params: { id: products.id } }"></router-link>
```

这里进行路由跳转时，会动态匹配 `name=pdp` 的路由规则，并把 `params` 参数传过去。

### 获取路由中传递过来的参数

1. 首先注入$route对象，使得组件可以直接访问vue-router中的$route 实例，从而获取当前路由的信息。
2. 之后定义一个属性来获取路由参数。

```vue
<script>
  export default {
      // ...
      inject: ['$route'],
      // ...
      data() {
          return {
              getIdFromRoute: this.$route.params.id,
          }
      }
      // 另外一种使用computed的方法:
      computed: {
          getIdFromRoute() {
            return this.$route.params.id
          }
      }
  }
</script>
```

通过一个自定义的属性来取到当前的商品信息，然后就可以在组件中直接使用。

```vue
<template>
  <!-- 使用示例 -->
  <img :src="currentProduct.img" />
  <div>{{ currentProduct.title }}</div>
</template>

<script>
  export default {
    // ...
    computed: {
      currentProduct() {
        return this.products.find(
          (product) => product.id === this.getIdFromRoute
        );
      },
    },
    // ...
  };
</script>
```

**在 `main.js` 中注入 `VueRouter` 的标准流程：**

在 Vue 应用中，`$router` 和 `$route` 对象是通过 `Vue Router` 插件自动注入到每个 `Vue` 实例（包括组件实例）中的。当在 `main.js` 文件中创建并使用 `VueRouter` 实例，并将其作为选项传递给 `Vue` 构造器时，`Vue` 将会自动处理注入过程。

```js
// 导入 Vue 和 VueRouter
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue"; // 你的主组件
import Home from "./components/Home.vue"; // 示例组件
import About from "./components/About.vue"; // 示例组件

// 创建 VueRouter 实例
const router = new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/about", component: About },
    //另一种写法： component: () => import("@/components/HelloWorld.vue")
  ],
});

// 注册 VueRouter 插件并注入 $router
Vue.use(VueRouter);

// 创建并挂载 Vue 根实例，传入 router
new Vue({
  router, // 这里是关键，传入 router 实例
  render: (h) => h(App),
}).$mount("#app");
```

在这个例子中，`Vue.use(VueRouter)` 是注册插件的必要步骤，然后在创建 `Vue` 根实例时，通过 `router` 选项将路由器实例传递给 Vue。这使得 `$router` 可以在任何组件中通过 `this` 访问。

```js
// 在任何组件中，你都可以使用 $router
export default {
  methods: {
    navigateToAbout() {
      this.$router.push("/about");
    },
  },
};
```
