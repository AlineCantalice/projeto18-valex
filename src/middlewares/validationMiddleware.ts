import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export default function validateSchema(schema: Schema){
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body);
        if(validation.error){
            throw {
                status: 422,
                message: validation.error.details
            }
        }
        next();
    }
}