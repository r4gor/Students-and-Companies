import { Router, Request, Response } from "express";
import {ProfileController} from "../controllers/profile_controller";

const router = Router();

router.post("/profile/get_user_profile", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/get_user_tags", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/add_tag_to_user", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/remove_tag_from_user", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/get_cv", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/get_company_internships", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});

router.post("/profile/invite_student", (req: Request, res: Response) => {
    new ProfileController(req, res).handle()
});


export default router;