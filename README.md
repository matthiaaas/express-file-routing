# express-file-routing

`0` dependencies

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

// uses /routes directory by default
app.use(router())

app.listen(2000)
```

#### Direcoty Structure

```ts
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
  router({ directory })
)
```

### Options

- `directory`: The path to the routes directory
