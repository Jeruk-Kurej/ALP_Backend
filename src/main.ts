import express from "express"
import path from "path"
import cors from "cors"
import { PORT } from "./util/env-util"
import { publicRouter } from "./routes/public-api"
import { privateRouter } from "./routes/private-api"
import { errorMiddleware } from "./middleware/error-middleware"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))

app.use("/api", publicRouter)
app.use("/api", privateRouter)

app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Connected to port ${PORT}`)
})