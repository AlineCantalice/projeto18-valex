import { findById } from "../repositories/businessRepository";

export async function getBusinessById(id: number) {
    return await findById(id);
}