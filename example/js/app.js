const express = require("express")

const { createRouter } = require("../../dist")

const app = express()

app.use(express.json())

createRouter(app)

app.listen(2000, () => console.log("server started"))
