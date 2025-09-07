# remix-wemake-challenge

senior helper web app using bun + react v19 + react-router v7 framework + tailwindcss v4 + shadcn/ui + zustand + tanstack query + drizzle + superbase

## how to run

### setup

- install latest bun runtime

```sh
$ curl -fsSL https://bun.sh/install | bash
bun was installed successfully to ~/.bun/bin/bun

$ bun -v
1.2.15
```

### configure

- install packages with bun

```sh
$ bun init
$ bun i
```

- define runtime variables

```sh
$ cat .env
MODE=DEV
API_BASE_URL=localhost:9000
VITE_API_BASE_URL=http://localhost:9000
VITE_APP_PORT=5173
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
DATABASE_URL=
```

- generate db schema

```sh
$ bun run db:generate
$ drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '{workspace}\remix-wemake-challenge\drizzle.config.ts'
6 tables
cafes 10 columns 0 indexes 0 fks
ingredients 4 columns 0 indexes 1 fks
items 8 columns 0 indexes 1 fks
recipe_ingredients 3 columns 0 indexes 2 fks
recipes 8 columns 0 indexes 1 fks
users 8 columns 1 indexes 1 fks

[✓] Your SQL migration file ➜ app\models\migrations\0000_huge_wallop.sql 🚀
No schema changes, nothing to migrate 😴
```

- migrate db schema

```sh
$ bun run db:migrate
$ drizzle-kit migrate
No config path provided, using default 'drizzle.config.ts'
Reading config file '{workspace}\remix-wemake-challenge\drizzle.config.ts'
Using 'pg' driver for database querying
[✓] migrations applied successfully!
```

### launch

- run bun app with development mode

```sh
$ bun dev
$ react-router dev
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

- run bun app with production mode

```sh
$ bun run build
$ docker build -t my-app .
$ docker run -p 3000:3000 my-app
```
