import dayjs from "dayjs";
import { Request, Response } from "express";
import { insert, PaymentInsertData } from "../repositories/paymentRepository";
import { getBusinessById } from "../services/businessService";
import { existCardById, getBalance, isTodayTheExpirationDate, verifyPassword } from "../services/cardsService";
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
    try {
        const { cardId } = req.params;
        const { password, businessId, amount } = req.body;

        const card = await existCardById(Number(cardId));
        if (!card) {
            return res.status(404).send("Cartão não cadastrado!");
        }

        if (!card.password) {
            return res.status(401).send("Cartão precisa estar ativado!");
        }

        const today = dayjs().format('MM/YY');
        const expired = await isTodayTheExpirationDate(today, card.expirationDate);
        if (expired) {
            return res.status(401).send("Cartão expirado")
        }

        if(card.isBlocked){
            return res.status(401).send("Cartão bloqueado")
        }

        const validPassword = verifyPassword(password, card.password);
        if(!validPassword){
            return res.status(401).send("Senha incorreta!");
        }

        const business = await getBusinessById(Number(businessId));
        if(!business){
            return res.status(404).send("Estabelecimento não cadastrado!");
        }

        if(business.type !== card.type){
            return res.status(401).send("Cartão não autorizado, tipo diferente do estabelecimento!");
        }

        const balance = await getBalance(card);
        if(balance.balance < amount){
            return res.status(401).send("Saldo insuficiente!");
        }

        const paymentData: PaymentInsertData = {
            cardId: card.id,
            businessId: businessId,
            amount: amount
        }
        await insert(paymentData);

        res.status(200).send("Compra realizada com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}