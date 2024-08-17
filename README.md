how to run this project

1. yarn install
2. yarn create prisma generate --schema=prisma/postgres.schema.prisma && yarn create prisma generate --schema=prisma/sqlserver.schema.prisma
3. yarn dev
4. yarn create prisma studio (optional)

---

next project untuk pull schema existing db

yarn create prisma db pull
