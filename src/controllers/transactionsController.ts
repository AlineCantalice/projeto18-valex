import dayjs from "dayjs";
import { Request, Response } from "express";
import { existCardById, isTodayTheExpirationDate } from "../services/cardsService";
import { existCompanyByApiKey } from "../services/companyService";
import { rechargeCard } from "../services/rechargeService";

export async function createRecharge(req: Request, res: Response) {
    try {
        const { cardId } = req.params;
        const apiKey = req.headers['x-api-key'];
        const { amount } = req.body;

        const company = await existCompanyByApiKey(apiKey.toString());
        if (!company) {
            return res.status(401).send("Empresa não cadastrada!")
        }

        const card = await existCardById(Number(cardId));
        if (!card) {
            return res.status(404).send("Cartão não cadastrado!");
        }

        const today = dayjs().format('MM/YY');
        const expired = await isTodayTheExpirationDate(today, card.expirationDate);
        if (expired) {
            return res.status(401).send("Cartão expirado")
        }

        if (!card.password) {
            return res.status(401).send("Cartão precisa estar ativado!");
        }

        await rechargeCard(card, amount)

        res.status(200).send("Cartão recarregado com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }

}

export async function buy(req: Request, res: Response) {
    
}