import { Card } from "../repositories/cardRepository";
import { findByCardId, insert, RechargeInsertData } from "../repositories/rechargeRepository";

export async function getRechargesByCardId(cardId: number) {
    return await findByCardId(cardId);
}

export async function rechargeCard(card: Card, amount: number) {
    const rechargeData: RechargeInsertData = {
        cardId: card.id,
        amount: amount
    }

    await insert(rechargeData);
}