import { NextFunction, Request, Response } from "express";

interface Error {
    status?: number;
    message?: string;
}

export default function handleErrorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log(error)
    if (error) {
        res.status(error.status).send(error.message);
    }
    res.sendStatus(500);
}