import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import {AccountManager} from "./components/account_manager";
import {Status} from "./utils/status";
import pool from "./utils/db_pool";
import {QueryResult} from "pg";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/random_query", async (req: Request, res: Response) => {

    console.log(typeof process.env.POSTGRES_PASSWORD);

    let result: QueryResult  = await pool.query("SELECT NOW()");
    res.json(result.rows);
    res.send("Express + TypeScript Server");

});

// app.use("/api", bookRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});