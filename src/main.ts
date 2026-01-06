import express from "express"
import path from "path"
import cors from "cors"
import { PORT } from "./util/env-util"
import { publicRouter } from "./routes/public-api"
import { privateRouter } from "./routes/private-api"
import { errorMiddleware } from "./middleware/error-middleware"
import { runSeeder } from "../prisma/seed"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))

app.use("/api", publicRouter)
app.use("/api", privateRouter)

app.use(errorMiddleware)

async function startServer() {
    try {
        // Run seeder to ensure payment methods exist
        await runSeeder()

        app.listen(PORT || 3000, () => {
            console.log(`Connected to port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()