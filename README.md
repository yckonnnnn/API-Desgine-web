# Foyton

**AI API 平台 — 让每一个请求都值得。**

Foyton 是一个面向开发者的 AI 模型 API 服务平台，提供多模型统一接入、用量监控、密钥管理和按量计费能力。

## ✨ 特性

### 平台能力

- **模型广场** — 聚合主流 AI 模型，一处接入，灵活切换
- **API 密钥管理** — 创建、禁用、重命名密钥，细粒度控制访问
- **用量监控** — 实时查看 Token 消耗、请求数、成功率
- **钱包系统** — 充值余额，按量计费，账单明细可查
- **服务保障** — 99.99% 可用率，120ms 路由延迟，24/7 持续服务

### 技术亮点

- **玻璃态视觉设计** — Liquid Glass 组件、渐变光效、精致细节
- **流畅动效** — GSAP 驱动滚动动画，Lenis 平滑滚动
- **3D 渲染** — Three.js + React Three Fiber 沉浸式视觉体验
- **多语言支持** — 中英文无缝切换
- **全栈类型安全** — TanStack Start + TypeScript + Zod

## 🛠️ 技术栈

### 前端

- [React 19](https://react.dev) — UI 框架
- [TanStack Start](https://tanstack.com/start) — 全栈 React 框架
- [TanStack Router](https://tanstack.com/router) — 类型安全路由
- [Tailwind CSS 4](https://tailwindcss.com) — 原子化样式
- [Radix UI](https://www.radix-ui.com) — 无障碍组件基元
- [GSAP](https://gsap.com) — 专业级动画
- [Lenis](https://lenis.darkroom.engineering) — 平滑滚动
- [Three.js](https://threejs.org) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D 渲染
- [Recharts](https://recharts.org) — 数据可视化
- [Lucide React](https://lucide.dev) — 图标库
- [Zustand](https://zustand-demo.pmnd.rs) — 状态管理
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — 表单验证

### 后端

- [Better Auth](https://www.better-auth.com) — 认证系统
- [PostgreSQL](https://www.postgresql.org) — 数据库
- [Kysely](https://kysely.dev) — 类型安全 SQL 查询
- [Nitro](https://nitro.unjs.io) — 服务端引擎

### 工具链

- [TypeScript](https://www.typescriptlang.org) — 类型系统
- [Vite](https://vite.dev) — 构建工具
- [Playwright](https://playwright.dev) — 端到端测试
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) — 代码规范

## 📁 项目结构

```
.
├── src/
│   ├── components/
│   │   ├── auth/           # 认证相关组件
│   │   ├── console/        # 控制台组件
│   │   ├── glass/          # 玻璃态 UI 组件
│   │   ├── hero/           # 首屏 Hero 区块
│   │   ├── layout/         # 布局组件（导航、页脚等）
│   │   └── sections/       # 首页各区块
│   ├── lib/
│   │   ├── auth/           # 认证逻辑
│   │   ├── fyt.ts          # 服务端 API 函数
│   │   ├── format.ts       # 格式化工具
│   │   └── language.ts     # 多语言支持
│   ├── routes/
│   │   ├── console/        # 控制台页面
│   │   └── index.tsx       # 首页
│   ── styles.css          # 全局样式
── migrations/             # 数据库迁移
├── public/                 # 静态资源
── scripts/                # 构建/部署脚本
└── server/                 # 服务端中间件
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 22
- npm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:8080` 启动（绑定 `0.0.0.0`）。

### 生产构建

```bash
npm run build
```

### 预览构建产物

```bash
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

### 代码格式化

```bash
npm run format
```

## 📦 部署

本项目部署于 [Vercel](https://vercel.com)。

推送 `main` 分支即可自动构建并部署：

```bash
git push origin main
```

## 🌐 页面结构

| 路由 | 说明 |
|------|------|
| `/` | 首页（Hero、生态系统、为什么选我们、基础设施、曲速隧道） |
| `/models` | 模型广场 |
| `/docs` | API 文档 |
| `/contact` | 联系我们 |
| `/console` | 控制台概览 |
| `/console/wallet` | 钱包充值 |
| `/console/keys` | API 密钥管理 |
| `/console/usage` | 用量统计 |
| `/console/billing` | 账单明细 |

## 📄 License

Copyright © 2026 Foyton. All rights reserved.
