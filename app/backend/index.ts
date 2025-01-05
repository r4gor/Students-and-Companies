import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import bookRoutes from "./routes/bookRoutes";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// app.use("/api", bookRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});