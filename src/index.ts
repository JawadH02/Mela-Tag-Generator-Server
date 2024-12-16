import dotenv from "dotenv"
dotenv.config()

import express, { Express } from "express";
import cors from "cors"
import router from "./routes/index"
import { errorHandler } from "./middlewares/error.middleware";


const app: Express = express();
const PORT = process.env.SERVER_PORT || 3000

// Middlewares
app.use(cors(({ origin: `http://localhost:5173`, optionsSuccessStatus: 200 })))
app.use(express.json())

// Routes
app.use("/api", router)

// Global Error Handler
app.use(errorHandler)

if (require.main === module) {

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}