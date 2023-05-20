# express-file-routing

![GitHub release (latest by date)](https://img.shields.io/github/v/release/matthiaaas/express-file-routing?color=brightgreen&label=latest)

Flexible system-based file routing for Express with `0` dependencies.

## Installation

```bash
npm install express-file-routing
```

**Note:** If you prefer `yarn` instead of `npm`, just use `yarn add express-file-routing`.

## How to use

Fundamentally, there are two ways of adding this library to your codebase: either as a middleware `app.use("/", router())`, which will add a separate [mini-router](http://expressjs.com/en/5x/api.html#router) to your app, or by wrapping your whole Express instance with a `createRouter(app)`, which will bind the routes directly to your app. In most cases, it doesn't matter on what option you decide, even though one or the other might perform better in some scenarios.

- app.ts (main)

```ts
import express from "express"
import createRouter, { router } from "express-file-routing"

const app = express()

// Option 1
app.use("/", router()) // as router middleware or

// Option 2
createRouter(app) // as wrapper function

app.listen(2000)
```

**Note:** It uses your project's `/routes` directory as source by default.

- routes/index.ts

```ts
export default async (req, res) => {
  if (req.method !== "GET") return res.status(405)

  return res.json({ hello: "world" })
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
        └── :id.ts or [id].ts // dynamic params
    └── users.ts
└── package.json
```

- `/routes/index.ts` → /
- `/routes/posts/index.ts` → /posts
- `/routes/posts/[id].ts` → /posts/:id
- `/routes/users.ts` → /users

**Note:** Files prefixed with an underscore or ending with `.d.ts` are excluded from route generation.

## API

```ts
createRouter(app, {
  directory: path.join(__dirname, "routes"),
  additionalMethods: ["ws", ...]
})
// or
app.use("/", router({
  directory: path.join(__dirname, "routes"),
  additionalMethods: ["ws", ...]
}))
```

### Options

- `directory`: The path to the routes directory (defaults to `/routes`)
- `additionalMethods`: Additional methods that match an export from a route like `ws` (e.g. `ws` for express-ws)

## Examples

### HTTP Method Matching

If you export functions named e.g. `get`, `post`, `put`, `patch`, `delete`/`del` [etc.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) those will get matched their corresponding http method automatically.

```ts
export const get = async (req, res) => { ... }

export const post = async (req, res) => { ... }

// it's not allowed to name variables 'delete': try 'del' instead
export const del = async (req, res) => { ... }

// you can still use a wildcard default export in addition
export default async (req, res) => { ... }
```

**Note:** Named method exports gain priority over wildcard exports (= default exports).

### Middlewares

You can add isolated, route specific middlewares by exporting an array of Express request handlers from your route file.

```ts
import { rateLimit, bearerToken, userAuth } from "../middlewares"

export const get = [
  rateLimit(), bearerToken(), userAuth(),
  async (req, res) => { ... }
]
```

A middleware function might look like the following:

```ts
// middlewares/userAuth.ts
export default (options) => async (req, res, next) => {
  if (req.authenticated) next()
  ...
}
```

### Custom Methods Exports

You can add support for other method exports to your route files. This means that if your root app instance accepts non built-in handler invocations like `app.ws(route, handler)`, you can make them being recognized as valid handlers.

```ts
// app.ts
import ws from "express-ws"

const { app } = ws(express())

createRouter(app, {
  additionalMethods: ["ws"]
})

// routes/index.ts
export const ws = async (ws, req) => {
  ws.send("hello world")
}
```

### Usage with TypeScript

Adding support for route & method handler type definitions is as straightforward as including Express' native `Handler` type from [@types/express](https://www.npmjs.com/package/@types/express).

```ts
// routes/posts.ts
import type { Handler } from "express"

export const get: Handler = async (req, res, next) => { ... }
```

### Error Handling

It is essential to catch potential errors (500s, 404s etc.) within your route handlers and forward them through `next(err)` if necessary, as treated in the Express' docs on [error handling](https://expressjs.com/en/guide/error-handling.html).

Defining custom error-handling middleware functions should happen _after_ applying your file-system routes.

```ts
app.use("/", router()) // or createRouter(app)

app.use(async (err, req, res, next) => {
  ...
})
```

### Catch-All (unstable)

This library lets you extend dynamic paths to catch-all routes by prefixing it with three dots `...` inside the brackets. This will make that route match itself but also all subsequent routes within that route.

**Note:** Since this feature got added recently, it might be unstable. Feedback is welcome.

```ts
// routes/users/[...catchall].js
export const get = async (req, res) => {
  return res.json({ path: req.params[0] })
}
```

- `/routes/users/[...catchall].js` matches /users/a, /users/a/b and so on, but **not** /users.
