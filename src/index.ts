import express from "express";
import { connectToDatabase } from "./services/database.service"
import { cutdedRouter } from "./routes/cutded.router";

const app = express();
const port = 42069; // default port to listen

connectToDatabase()
    .then(() => {
        app.use("/", cutdedRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

