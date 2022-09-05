import { findById } from "../repositories/businessRepository";

export async function getBusinessById(id: number) {
    const business = await findById(id);

    if (!business) {
        throw {
            status: 404,
            message: "Estabelecimento não encontrado"
        }
    }

    return business;
}