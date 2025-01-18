import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";

import sign_up_routes from "./routes/sign_up_routes";
import edit_profile_routes from "./routes/edit_profile_routes";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Server ONLINE");
});

app.use("/api", sign_up_routes);
app.use("/api", edit_profile_routes);


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});