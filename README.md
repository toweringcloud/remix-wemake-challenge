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
API_BASE_URL=http://localhost:3000
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
