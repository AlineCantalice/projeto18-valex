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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockCard = exports.blockCard = exports.getCardBalance = exports.activateCard = exports.createCard = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const cardsService_1 = require("../services/cardsService");
const companyService_1 = require("../services/companyService");
const employeeService_1 = require("../services/employeeService");
function createCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { employeeId } = req.params;
            const apiKey = req.headers['x-api-key'];
            const { type } = req.body;
            const company = yield (0, companyService_1.existCompanyByApiKey)(apiKey.toString());
            if (!company) {
                return res.status(401).send("Empresa não cadastrada!");
            }
            const employee = yield (0, employeeService_1.existEmployeeById)(Number(employeeId));
            if (!employee) {
                return res.status(404).send("Funcionário não cadastrado!");
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
            const { cardId } = req.params;
            const { cvc, password } = req.body;
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            const today = (0, dayjs_1.default)().format('MM/YY');
            const expired = yield (0, cardsService_1.isTodayTheExpirationDate)(today, card.expirationDate);
            if (expired) {
                return res.status(401).send("Cartão expirado");
            }
            if (card.password) {
                return res.status(401).send("Cartão já ativado!");
            }
            const authorizedCVC = (0, cardsService_1.isAuthorizedCVC)(card.securityCode, cvc);
            if (!authorizedCVC) {
                return res.status(401).send("CVC incorreto!!");
            }
            yield (0, cardsService_1.activateCardEmployee)(card, password);
            res.status(200).send("Cartão ativado com sucesso!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.activateCard = activateCard;
function getCardBalance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cardId } = req.params;
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            const balance = yield (0, cardsService_1.getBalance)(card);
            const obj = JSON.stringify(balance);
            res.status(200).send(obj);
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
            const { cardId } = req.params;
            const { password } = req.body;
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            const today = (0, dayjs_1.default)().format('MM/YY');
            const expired = yield (0, cardsService_1.isTodayTheExpirationDate)(today, card.expirationDate);
            if (expired) {
                return res.status(401).send("Cartão expirado");
            }
            if (card.isBlocked) {
                return res.status(401).send("Cartão já bloqueado!");
            }
            const validPassword = (0, cardsService_1.verifyPassword)(password, card.password);
            if (!validPassword) {
                return res.status(401).send("Senha incorreta!");
            }
            yield (0, cardsService_1.block)(card);
            res.status(200).send("Cartão bloqueado com sucesso!");
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
            const { cardId } = req.params;
            const { password } = req.body;
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            const today = (0, dayjs_1.default)().format('MM/YY');
            const expired = yield (0, cardsService_1.isTodayTheExpirationDate)(today, card.expirationDate);
            if (expired) {
                return res.status(401).send("Cartão expirado");
            }
            if (!card.isBlocked) {
                return res.status(401).send("Cartão já desbloqueado!");
            }
            const validPassword = (0, cardsService_1.verifyPassword)(password, card.password);
            if (!validPassword) {
                return res.status(401).send("Senha incorreta!");
            }
            yield (0, cardsService_1.unblock)(card);
            res.status(200).send("Cartão desbloqueado com sucesso!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.unblockCard = unblockCard;
