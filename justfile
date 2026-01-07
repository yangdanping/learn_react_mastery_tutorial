# 安装依赖
i:
    pnpm i

# 交互式升级所有包到最新版本
up:
    pnpm up -i --latest

# 启动开发服务器
dev:
    pnpm run dev

# 执行代码检查 (ESLint)
lint:
    pnpm run lint

# 类型检查
type-check:
    pnpm exec tsc --noEmit

# 执行生产环境构建
build:
    pnpm run build
