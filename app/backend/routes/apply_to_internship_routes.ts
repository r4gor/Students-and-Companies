import { Router, Request, Response } from "express";
import {ApplyToInternshipController} from "../controllers/apply_to_internship_controller";

const apply_to_internship_router = Router();

apply_to_internship_router.post("/apply_to_internship/", (req: Request, res: Response) => {
    new ApplyToInternshipController(req, res).handle()
});

apply_to_internship_router.get("/fetch_own_internships/", (req: Request, res: Response) => {
    new ApplyToInternshipController(req, res).handle()
});

export default apply_to_internship_router;