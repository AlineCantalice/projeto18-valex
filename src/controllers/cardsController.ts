import { Request, Response } from "express";
import { activateCardEmployee, block, createCardEmployee, existCompanyByApiKey, existEmployeeById, existEmployeeCardType, getAllCards, getBalance, unblock } from "../services/cardsService";

export async function createCard(req: Request, res: Response) {
    try {
        const { employeeId } = req.params;
        const apiKey = req.headers['x-api-key'];
        const { type } = req.body;

        const company = await existCompanyByApiKey(apiKey.toString());
        if(!company){
            return res.status(404).send("Empresa não cadastrada!")
        }

        const employee = await existEmployeeById(Number(employeeId));
        if(!employee){
            return res.status(404).send("Funcionário não cadastrada!")
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
        const { id } = req.params;
        const { cvc, password } = req.body;

        activateCardEmployee(Number(id), cvc, password);

        res.status(200).send("Cartão ativado com sucesso!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function getCardByEmployee(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { cards } = req.body;

        getAllCards(Number(id), cards);

        res.status(200).send("Todos os cartões do funcionário!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function getCardBalance(req: Request, res: Response) {
    try {
        const { id } = req.params;

        getBalance(Number(id));

        res.status(200).send("Todos os cartões do funcionário!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function blockCard(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        block(Number(id), password);

        res.status(200).send("Todos os cartões do funcionário!");
    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}

export async function unblockCard(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        unblock(Number(id), password);

    } catch (error) {
        res.status(500).send("Algo deu errado! :(")
    }
}