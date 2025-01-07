import { Request, Response } from "express";

abstract class Controller {
    private req: Request
    private res: Response

    public constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    public abstract handle(): void
}