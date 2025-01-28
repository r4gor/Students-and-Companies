import { ComplaintController } from "controllers/complaints_controller";
import { Router, Request, Response } from "express";

const complaint_router = Router();

complaint_router.get("/get/", (req: Request, res: Response) => {
    new ComplaintController(req, res).handle()
});

complaint_router.post("/post/", (req: Request, res: Response) => {
    new ComplaintController(req, res).handle()
});

export default complaint_router;