import { NextFunction, Request, Response } from "express";
import { existCompanyByApiKey } from "../services/companyService";

export default async function apiKeyValidate(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | string[] = req.headers['x-api-key'];
  if (!apiKey.toString()) {
    throw {
      status: 401,
      message: "ApiKey não encontrada!"
    }
  }

  const company = await existCompanyByApiKey(apiKey.toString());

  res.locals.company = company;

  next();
}