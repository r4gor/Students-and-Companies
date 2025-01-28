import { Router, Request, Response } from "express";
import {InternshipManagementController} from "../controllers/internship_management_controller";

const internship_management_router = Router();

internship_management_router.post("/apply_to_internship/", (req: Request, res: Response) => {
    new InternshipManagementController(req, res).handle()
});

internship_management_router.get("/fetch_student_internships/", (req: Request, res: Response) => {
    new InternshipManagementController(req, res).handle()
});

internship_management_router.get("/fetch_company_internships/", (req: Request, res: Response) => {
    new InternshipManagementController(req, res).handle()
});

internship_management_router.get("/close_internship/", (req: Request, res: Response) => {
    new InternshipManagementController(req, res).handle()
});

export default internship_management_router;