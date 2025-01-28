import { Router, Request, Response } from "express";
import {EditProfileController} from "../controllers/edit_profile_controller";

const router = Router();

router.post("/edit_profile/get_user_profile", (req: Request, res: Response) => {
    new EditProfileController(req, res).handle()
});

router.post("/edit_profile/update_profile", (req: Request, res: Response) => {
    new EditProfileController(req, res).handle()
});

export default router;