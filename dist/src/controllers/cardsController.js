"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockCard = exports.blockCard = exports.getCardBalance = exports.getCardByEmployee = exports.activateCard = exports.createCard = void 0;
const cardsService_1 = require("../services/cardsService");
function createCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { employeeId } = req.params;
            const apiKey = req.headers['x-api-key'];
            const { type } = req.body;
            const company = yield (0, cardsService_1.existCompanyByApiKey)(apiKey.toString());
            if (!company) {
                return res.status(404).send("Empresa não cadastrada!");
            }
            const employee = yield (0, cardsService_1.existEmployeeById)(Number(employeeId));
            if (!employee) {
                return res.status(404).send("Funcionário não cadastrada!");
            }
            const card = yield (0, cardsService_1.existEmployeeCardType)(Number(employeeId), type);
            if (card) {
                return res.status(404).send("Funcionário já possui cartão desse tipo!");
            }
            yield (0, cardsService_1.createCardEmployee)(employee, type);
            res.status(201).send("Cartão criado com sucesso!!!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :( " + error);
        }
    });
}
exports.createCard = createCard;
function activateCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { cvc, password } = req.body;
            (0, cardsService_1.activateCardEmployee)(Number(id), cvc, password);
            res.status(200).send("Cartão ativado com sucesso!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.activateCard = activateCard;
function getCardByEmployee(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { cards } = req.body;
            (0, cardsService_1.getAllCards)(Number(id), cards);
            res.status(200).send("Todos os cartões do funcionário!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.getCardByEmployee = getCardByEmployee;
function getCardBalance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            (0, cardsService_1.getBalance)(Number(id));
            res.status(200).send("Todos os cartões do funcionário!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.getCardBalance = getCardBalance;
function blockCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { password } = req.body;
            (0, cardsService_1.block)(Number(id), password);
            res.status(200).send("Todos os cartões do funcionário!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.blockCard = blockCard;
function unblockCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { password } = req.body;
            (0, cardsService_1.unblock)(Number(id), password);
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.unblockCard = unblockCard;
