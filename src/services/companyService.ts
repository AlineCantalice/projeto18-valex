import { findByApiKey } from "../repositories/companyRepository";

export async function existCompanyByApiKey(apiKey: string) {
    return await findByApiKey(apiKey);
}