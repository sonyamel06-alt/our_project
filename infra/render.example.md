# Render: шаги (ручно через UI)
1) Создать PostgreSQL (Managed Database).
2) Создать Web Service для API:
   - Build command: pnpm --filter api build
   - Start command: pnpm --filter api start
   - Environment variables: DATABASE_URL, FRONTEND_URL (адрес фронта в Render), PORT=4000
3) Создать Static Site для фронта или Web Service:
   - Static site: Build command: pnpm --filter web build
   - Publish directory: services/web/dist
4) После получения DATABASE_URL: локально выполнить:
   - pnpm --filter api prisma:generate
   - pnpm --filter api prisma:migrate
   - pnpm --filter api run seed
5) Загрузить изображения через POST /api/memories (curl пример ниже).
