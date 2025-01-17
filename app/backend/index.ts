import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";

import sign_up_routes from "./routes/sign_up_routes";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/api", sign_up_routes);


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});