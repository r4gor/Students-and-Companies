import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { create_internship_route } from "./routes/internship_creation_routes";
import { search_internships_route } from "./routes/internship_browsing_routes";
import cors from "cors";

import sign_up_routes from "./routes/sign_up_routes";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/api/create_internship", create_internship_route);
app.use("/api/internship_browsing/search_internships", search_internships_route);
app.use("/api", sign_up_routes);


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});