import { Router, Request, Response } from "express";
import {ApplyToInternshipController} from "../controllers/apply_to_internship_controller";

const internship_management_router = Router();

internship_management_router.post("/apply_to_internship/", (req: Request, res: Response) => {
    new ApplyToInternshipController(req, res).handle()
});

internship_management_router.get("/fetch_student_internships/", (req: Request, res: Response) => {
    new ApplyToInternshipController(req, res).handle()
});

internship_management_router.get("/fetch_company_internships/", (req: Request, res: Response) => {
    new ApplyToInternshipController(req, res).handle()
});

export default internship_management_router;