import { findByCardId } from "../repositories/paymentRepository";

export async function getPaymentsByCardId(cardId: number) {
    return await findByCardId(cardId);
}