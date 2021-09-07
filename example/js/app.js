const express = require("express")
const { router } = require("../../dist")

const app = express()

app.use(express.json())

app.use("/api", router({ directory: "api" }))

app.listen(3000, () => console.log("server started"))
