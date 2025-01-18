import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import {sign_in_route} from "./routes/sign_in_routes";
import {notifications_route} from "./routes/notifications_routes";

var cors = require("cors")

const app: Express = express();
const port: string = process.env.PORT || "4001";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// app.use("/api", sign_up_routes);
app.use("/api/sign_in/", sign_in_route);
app.use("/api/notifications/", notifications_route);


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    // new AccountManager("student1@example.com", "pass123").sign_in()
});
