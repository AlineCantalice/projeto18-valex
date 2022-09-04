import dayjs from "dayjs";
import { Request, Response } from "express";
import { activateCardEmployee, block, createCardEmployee, existCardById, existEmployeeCardType, getBalance, isAuthorizedCVC, isTodayTheExpirationDate, unblock, verifyPassword } from "../services/cardsService";
import { existCompanyByApiKey } from "../services/companyService";
import { existEmployeeById } from "../services/employeeService";

export async function createCard(req: Request, res: Response) {
    try {
        const { employeeId } = req.params;
        const apiKey = req.headers['x-api-key'];
        const { type } = req.body;

        const company = await existCompanyByApiKey(apiKey.toString());
        if(!company){
            return res.status(401).send("Empresa não cadastrada!")
        }

        const employee = await existEmployeeById(Number(employeeId));
        if(!employee){
            return res.status(404).send("Funcionário não cadastrado!")
        }

        const card = await existEmployeeCardType(Number(employeeId), type);
        if(card){
            return res.status(404).send("Funcionário já possui cartão desse tipo!")
        }

        await createCardEmployee(employee, type);

        res.status(201).send("Cartão criado com sucesso!!!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :( " + error)
    }
}

export async function activateCard(req: Request, res: Response) {
    try {
        const { cardId } = req.params;
        const { cvc, password } = req.body;

        const card = await existCardById(Number(cardId));
        if(!card){
            return res.status(404).send("Cartão não cadastrado!");
        }

        const today = dayjs().format('MM/YY');
        const expired = await isTodayTheExpirationDate(today, card.expirationDate);
        if(expired){
            return res.status(401).send("Cartão expirado")
        }

        if(card.password) {
            return res.status(401).send("Cartão já ativado!");
        }

        const authorizedCVC = isAuthorizedCVC(card.securityCode, cvc);
        if(!authorizedCVC){
            return res.status(401).send("CVC incorreto!!");
        }

        await activateCardEmployee(card, password);

        res.status(200).send("Cartão ativado com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function getCardBalance(req: Request, res: Response) {
    try {
        const { cardId } = req.params;

        const card = await existCardById(Number(cardId));
        if(!card){
            return res.status(404).send("Cartão não cadastrado!");
        }

        const balance = await getBalance(card);

        const obj = JSON.stringify(balance)

        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function blockCard(req: Request, res: Response) {
    try {
        const { cardId } = req.params;
        const { password } = req.body;

        const card = await existCardById(Number(cardId));
        if(!card){
            return res.status(404).send("Cartão não cadastrado!");
        }

        const today = dayjs().format('MM/YY');
        const expired = await isTodayTheExpirationDate(today, card.expirationDate);
        if(expired){
            return res.status(401).send("Cartão expirado")
        }

        if(card.isBlocked) {
            return res.status(401).send("Cartão já bloqueado!");
        }

        const validPassword = verifyPassword(password, card.password);
        if(!validPassword){
            return res.status(401).send("Senha incorreta!");
        }

        await block(card);

        res.status(200).send("Cartão bloqueado com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function unblockCard(req: Request, res: Response) {
    try {
        const { cardId } = req.params;
        const { password } = req.body;

        const card = await existCardById(Number(cardId));
        if(!card){
            return res.status(404).send("Cartão não cadastrado!");
        }

        const today = dayjs().format('MM/YY');
        const expired = await isTodayTheExpirationDate(today, card.expirationDate);
        if(expired){
            return res.status(401).send("Cartão expirado")
        }

        if(!card.isBlocked) {
            return res.status(401).send("Cartão já desbloqueado!");
        }

        const validPassword = verifyPassword(password, card.password);
        if(!validPassword){
            return res.status(401).send("Senha incorreta!");
        }

        await unblock(card);

        res.status(200).send("Cartão desbloqueado com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}