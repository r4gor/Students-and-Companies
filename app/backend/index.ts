import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import {sign_in_route} from "./routes/sign_in_routes";
import {notifications_route} from "./routes/notifications_routes";
import { create_internship_route } from "./routes/internship_creation_routes";
import { search_internships_route } from "./routes/internship_browsing_routes";
import cors from "cors";
import sign_up_routes from "./routes/sign_up_routes";
import edit_profile_routes from "./routes/edit_profile_routes";
import internship_management_router from "./routes/internship_management_routes";


const app: Express = express();
const port: string = process.env.PORT || "4001";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
    res.send("Server ONLINE");
});

app.use("/api/sign_in/", sign_in_route);
app.use("/api/notifications/", notifications_route);

app.use("/api", sign_up_routes);
app.use("/api", edit_profile_routes);
app.use("/api/create_internship", create_internship_route);
app.use("/api/internship_browsing/search_internships", search_internships_route);
app.use("/api/internship_management", internship_management_router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});