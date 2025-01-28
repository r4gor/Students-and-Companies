import { Router, Request, Response } from "express";
import {SingleInternshipController} from "../controllers/single_internship_controller";

const router = Router();

router.post("/single_internship/get_internship", (req: Request, res: Response) => {
    new SingleInternshipController(req, res).handle()
});


export default router;