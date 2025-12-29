// src/env.d.ts

// 如果你需要引入类型，请在声明内部引入，或者使用 import() 语法
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 确保没有在最外层写 export {} 或 import ...