# express-file-routing

Flexible system-based file routing for Express with `0` dependencies.

## Installation

```bash
npm install express-file-routing
```

_Note_: If you prefer `yarn` instead of `npm`, just use `yarn add express-file-routing`.

## How to use

```ts
import express from "express"
import router from "express-file-routing"

const app = express()

app.use(router()) // uses /routes directory by default

app.listen(2000)
```

```ts
export default async (req, res) => {
  if (req.method !== "GET") return res.status(404)

  return res.status(200)
}
```

#### Directory Structure

```php
├── app.ts
├── routes
    ├── index.ts
    ├── posts
        ├── index.ts
        └── :id.ts // dynamic params
    └── users.ts
└── package.json
```

## API

```ts
app.use(
  router({
    directory: path.join(__dirname, "routes")
  })
)
```

### Options

- `directory`: The path to the routes directory

## Examples

### HTTP Method Matching

```ts
export const get = async (res, res) => { ... }

export const post = async (req, res) => { ... }

// you can still use default wildcard export too
export default async (res, res) => { ... }
```

### Middlewares (with HOFs)

```ts
import { rateLimit, bearerToken, userAuth } from "../middlewares" // import middleware functions

export const get = [
  rateLimit(), bearerToken(), userAuth(),
  async (req, res) => { ... }
]
```
