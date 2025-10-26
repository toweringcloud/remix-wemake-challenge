# remix-wemake-challenge

shop assistant fullstack web app using react v19 + react-router v7 framework + tailwindcss v4 + shadcn/ui + zustand + zod + drizzle + postgresql

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
DATABASE_URL="postgresql://{id}:{pw}@{host}:{port}/{dbname}"
MODE=DEV
OPENAI_API_KEY=
RESEND_API_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_ANON_KEY=
SUPABASE_URL="https://{your_project}.supabase.co"
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- generate db schema

```sh
$ bun run db:generate
$ drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\work\templates\remix-wemake-challenge\drizzle.config.ts'
9 tables
cafes 10 columns 0 indexes 0 fks
ingredients 4 columns 0 indexes 1 fks
items 9 columns 0 indexes 2 fks
menus 11 columns 0 indexes 2 fks
products 4 columns 0 indexes 1 fks
recipe_ingredients 3 columns 0 indexes 2 fks
recipes 8 columns 0 indexes 2 fks
stocks 4 columns 0 indexes 1 fks
users 8 columns 0 indexes 1 fks

[✓] Your SQL migration file ➜ app\models\migrations\0000_thin_sleepwalker.sql 🚀
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

- add shadcn/ui components

```sh
$ bunx --bun shadcn@latest add button
√ Checking registry.
√ Installing dependencies.
√ Created 1 file:
  - app\components\ui\button.tsx
```

- add email templates

```sh
$ npx create-email@latest
√ React Email Starter files ready
react-email-starter
├── emails
│   ├── static
│   │   ├── notion-logo.png
│   │   ├── plaid-logo.png
│   │   ├── plaid.png
│   │   ├── stripe-logo.png
│   │   ├── vercel-arrow.png
│   │   ├── vercel-logo.png
│   │   ├── vercel-team.png
│   │   └── vercel-user.png
│   ├── notion-magic-link.tsx
│   ├── plaid-verify-identity.tsx
│   ├── stripe-welcome.tsx
│   └── vercel-invite-user.tsx
├── package.json
├── readme.md
└── tsconfig.json
```

- install gcloud sdk
  - https://cloud.google.com/sdk/docs/install

- generate gcloud default credentials

```sh
$ gcloud auth application-default login
Welcome! This command will take you through the configuration of gcloud.
...
Your browser has been opened to visit:
    https://accounts.google.com/o/oauth2/auth?...

Credentials saved to file: [C:\Users\{uid}\AppData\Roaming\gcloud\application_default_credentials.json]

These credentials will be used by any library that requests Application Default Credentials (ADC).

Quota project '{your_project_id}' was added to ADC which can be used by Google client libraries for billing and quota. Note that some services may still bill the project owning the resource.
...

$ cat /c/Users/{uid}/AppData/Roaming/gcloud/application_default_credentials.json
{
  "account": "?",
  "client_id": "?.apps.googleusercontent.com",
  "client_secret": "?",
  "quota_project_id": "?",
  "refresh_token": "?",
  "type": "authorized_user",
  "universe_domain": "googleapis.com"
}
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

- deploy docker app with production mode

```sh
$ bun run build
$ docker build -t my-app .
$ docker run -p 9000:3000 my-app
```

- deploy fly.io app with production mode

```sh
$ curl -L https://fly.io/install.sh | sh
$ fly launch
$ fly secret
$ fly deploy
```

### test

- download sample video file
  - [Pexcel](https://www.pexels.com)

- run tunnel client

```sh
$ bun -g i cloudflared
bun add v1.2.15 (df017990)

installed cloudflared@0.7.1 with binaries:
 - cloudflared

$ cloudflared tunnel --url http://localhost:5173
2025-09-17T17:21:08Z INF Requesting new quick Tunnel on trycloudflare.com...
2025-09-17T17:21:11Z INF +--------------------------------------------------------------------------------------------+
2025-09-17T17:21:11Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2025-09-17T17:21:11Z INF |  https://latter-optimization-roots-tested.trycloudflare.com
2025-09-17T17:21:11Z INF +--------------------------------------------------------------------------------------------+
2025-09-17T17:21:11Z INF Cannot determine default configuration path. No file [config.yml config.yaml] in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp]
2025-09-17T17:21:11Z INF Version 2025.8.1 (Checksum b5d598b00cc3a28cabc5812d9f762819334614bae452db4e7f23eefe7b081556)
2025-09-17T17:21:11Z INF GOOS: windows, GOVersion: go1.24.2, GoArch: amd64
```
