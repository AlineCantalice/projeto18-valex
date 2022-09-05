import { findByApiKey } from "../repositories/companyRepository";

export async function existCompanyByApiKey(apiKey: string) {
    const company = await findByApiKey(apiKey);

    if (!company) {
        throw {
            status: 404,
            message: "Empresa não encontrada"
        }
    }

    return company;
}