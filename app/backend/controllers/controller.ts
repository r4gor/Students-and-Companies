/**
 * Controller abstract class
 */
import { Request, Response } from "express";

export abstract class Controller {
    protected req: Request
    protected res: Response

    public constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    public abstract handle(): Promise<void>;
}
