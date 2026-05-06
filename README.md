# Online Judge

一个基于 Next.js 14 的在线评测平台，支持题目管理、Markdown 题面编辑、在线代码编辑、提交判题、提交记录查看，以及基于 DeepSeek 的 AI 编程辅助与代码分析。

## 功能特性

- 题目列表、题目详情、题目创建与编辑
- Markdown 题面与题解编辑，支持 GFM、代码高亮和数学公式
- Monaco Editor 在线代码编辑
- 支持 C++、Java、Python、JavaScript、TypeScript 提交
- 接入 Judge0 第三方沙箱进行代码执行与判题
- 提交状态、运行时间、内存、失败用例等判题信息展示
- 用户登录、资料页、用户列表
- DeepSeek AI 对话助手
- 针对题目和用户代码的 AI 代码分析报告

## 技术栈

- Framework: Next.js 14 App Router
- UI: React 18, Tailwind CSS, Radix UI, shadcn/ui 风格组件
- Editor: Monaco Editor, ByteMD
- Form: React Hook Form, Zod
- State: Zustand
- Auth: NextAuth Credentials Provider
- Database: MySQL, Drizzle ORM
- Judge: Judge0 API
- AI: DeepSeek Chat Completions API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 准备数据库

项目当前使用 MySQL，默认数据库名为 `online_judge`。先创建数据库：

```sql
CREATE DATABASE online_judge DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

数据库连接配置目前写在以下文件中：

- `drizzle.config.ts`
- `src/schema/db.client.ts`

默认配置为：

```text
host: localhost
user: root
password: 12345678
database: online_judge
```

如本地 MySQL 配置不同，请先修改上述两个文件。

### 3. 配置环境变量

在项目根目录创建或修改 `.env.local`：

```env
NODE_ENV=development
AUTH_SECRET=your-next-auth-secret

DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat

JUDGE0_API_URL=https://ce.judge0.com
```

说明：

- `AUTH_SECRET` 用于 NextAuth JWT 会话签名，开发环境也建议配置。
- `DEEPSEEK_API_KEY` 用于 AI 对话和代码分析功能。
- `DEEPSEEK_MODEL` 未配置时默认使用 `deepseek-chat`。
- `JUDGE0_API_URL` 未配置时默认使用 `https://ce.judge0.com`。

### 4. 同步数据库结构

```bash
npm run db:push
```

如需打开 Drizzle Studio 查看数据：

```bash
npm run db:ui
```

### 5. 启动开发服务

```bash
npm run dev
```

浏览器访问：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev      # 启动开发服务
npm run build    # 构建生产版本
npm run start    # 启动生产服务
npm run lint     # 运行 lint
npm run db:push  # 将 Drizzle schema 同步到 MySQL
npm run db:ui    # 打开 Drizzle Studio
```

## 项目结构

```text
src
├── app                  # Next.js App Router 页面与 API
│   ├── (main)           # 主布局页面：登录、首页、用户、题目创建、AI 聊天等
│   ├── api              # API Routes
│   └── problem/[id]     # 题目详情与提交页面
├── action               # Server Actions
├── common               # 通用 API 响应结构
├── components           # 页面组件、编辑器、布局、表格和 UI 组件
├── constants            # 角色、语言、判题结果、提交状态等枚举
├── core                 # 代码沙箱与判题服务
├── hooks                # 客户端 hooks
├── lib                  # 认证配置、用户工具和通用工具函数
├── repository           # Drizzle 数据访问层
├── schema               # Drizzle 表结构与数据库客户端
└── types                # 业务类型定义
```

## 核心模块

### 认证

认证配置位于 `src/lib/auth-options.ts`，使用 NextAuth Credentials Provider，通过邮箱和密码登录。用户密码使用 `bcrypt` 校验，会话策略为 JWT。

### 判题

判题入口位于 `src/core/judge.service.ts`。当前默认使用 `thirdparty` 沙箱实现，即 `src/core/impl/thirdparty.sandbox.ts`，通过 Judge0 的同步提交接口执行代码。

语言映射位于 `src/core/config/language.config.ts`：

- `cpp`
- `java`
- `python`
- `javascript`
- `typescript`

### AI 能力

AI 对话接口位于 `src/app/api/ai/chat/route.ts`。

代码分析接口位于 `src/app/api/problems/[id]/analysis/route.ts`，会结合题目内容、官方题解和用户代码生成结构化分析报告。

## 数据模型

主要表结构位于 `src/schema`：

- `user`: 用户信息、角色、邮箱、密码、软删除状态
- `problem`: 题目标题、题面、标签、题解、判题用例、判题配置、提交数和通过数
- `submit`: 用户提交记录、语言、代码、提交状态和判题信息

## 开发提示

- 新增或修改数据库字段后，更新 `src/schema/*.schema.ts`，再运行 `npm run db:push`。
- 题目判题用例存储在 `problem.judgeCase` 中，格式为 `{ input, output }[]`。
- 判题配置存储在 `problem.judgeConfig` 中，当前包含 `timeLimit` 和 `memoryLimit`。
- Judge0 的内存限制单位为 KB，项目表单中的内存限制单位为 MB，转换逻辑在 `src/core/judge.service.ts`。
- DeepSeek 功能依赖服务端环境变量，未配置 `DEEPSEEK_API_KEY` 时 AI 对话和代码分析会返回配置错误。
