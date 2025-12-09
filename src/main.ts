import express from "express"
import path from "path"
import cors from "cors"
import { PORT } from "./util/env-util"
import { publicRouter } from "./routes/public-api"
import { privateRouter } from "./routes/private-api"
import { errorMiddleware } from "./middleware/error-middleware"

const app = express()

app.use(express.static(path.join(__dirname, "../public")))

app.use(express.json())
app.use(cors())

app.use("/api", publicRouter)   
app.use("/api", privateRouter)  

app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Connected to port ${PORT}`)
})