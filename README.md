# Vue 3 + TypeScript 学习项目

基于 Vue 3、TypeScript 和 Vite 的极简项目，未安装路由、状态管理和 UI 组件库。

## 环境要求

- Node.js 18+
- npm 9+

当前使用 Vite 6，以兼容 Node.js 18。

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查并构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

## 目录结构

```text
study_vue3/
├── index.html          # HTML 入口
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 项目引用配置
├── tsconfig.app.json   # 应用代码的 TypeScript 配置
├── tsconfig.node.json  # Vite 配置的 TypeScript 配置
└── src/
    ├── main.ts         # 创建并挂载 Vue 应用
    ├── App.vue         # 根组件
    ├── style.css       # 全局样式
    └── vite-env.d.ts   # Vite 类型声明
```

## 编辑器推荐

使用 VS Code 时，建议安装 **Vue - Official** 扩展，并禁用旧的 Vetur 扩展，以获得 Vue 3 和 TypeScript 的语言支持。
