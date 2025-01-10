import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { create_internship_route } from "./routes/internship_creation_routes";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/api/create_internship", create_internship_route);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});