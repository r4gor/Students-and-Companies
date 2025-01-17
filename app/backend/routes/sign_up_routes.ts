import { Router, Request, Response } from "express";
import {SignUpController} from "../controllers/sign_up_controller";

const router = Router();

router.get("/sign_up/get_universities", (req: Request, res: Response) => {
    new SignUpController(req, res).handle()
});

router.post("/sign_up/create_account", (req: Request, res: Response) => {
    new SignUpController(req, res).handle()
});

export default router;