# express-file-routing

Flexible system-based file routing for Express with `0` dependencies.

## Installation

```bash
npm install express-file-routing
```

_Note:_ If you prefer `yarn` instead of `npm`, just use `yarn add express-file-routing`.

## How to use

- app.ts (main)

```ts
import express from "express"
import createRouter from "express-file-routing"

const app = express()

createRouter(app) // uses /routes directory by default

app.listen(2000)
```

- routes/index.ts

```ts
export default async (req, res) => {
  if (req.method !== "GET") return res.status(404)

  return res.status(200)
}
```

#### Directory Structure

Files inside your project's `/routes` directory will get matched an url path automatically.

```php
├── app.ts
├── routes
    ├── index.ts // index routes
    ├── posts
        ├── index.ts
        └── :id.ts // dynamic params
    └── users.ts
└── package.json
```

- `/routes/index.ts` → /
- `/routes/posts/index.ts` → /posts
- `/routes/posts/:id.ts` → /posts/:id
- `/routes/users.ts` → /users

## API

```ts
createRouter(app, {
  directory: path.join(__dirname, "routes"),
  methodExports: ["ws", ...]
})
```

### Options

- `directory`: The path to the routes directory (default /routes)
- `methodExports`: Additional method exports (e.g. `ws` for express-ws)

## Examples

### HTTP Method Matching

If you export functions named e.g. `get`, `post`, `put`, `delete` (...) those will get matched their corresponding http method automatically.

```ts
export const get = async (res, res) => { ... }

export const post = async (req, res) => { ... }

// you can still use a wildcard default export in addition
export default async (res, res) => { ... }
```

_Note:_ Named method exports gain priority over wildcard exports (= default exports).

### Middlewares

You can add isolated, route specific middlewares by exporting an array of Express request handlers from your route file.

```ts
import { rateLimit, bearerToken, userAuth } from "../middlewares"

export const get = [
  rateLimit(), bearerToken(), userAuth(),
  async (req, res) => { ... }
]
```

### Custom Methods Exports

You can add support for other method exports to your route files.

```ts
// app.ts
import ws from "express-ws"

const { app } = ws(express())

createRouter(app, {
  methodExports: ["ws"]
})

// routes/index.ts
export const ws = async (ws, req) => {
  ws.send("msg")
}
```
