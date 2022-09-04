import { findByCardId } from "../repositories/rechargeRepository";

export async function getRechargesByCardId(cardId: number) {
    return await findByCardId(cardId);
}