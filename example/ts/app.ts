import express from "express"

import createRouter from "../../dist"

const app = express()

app.use(express.json())

createRouter(app)

app.listen(3000)
