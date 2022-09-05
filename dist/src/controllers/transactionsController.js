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
exports.buy = exports.createRecharge = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const paymentRepository_1 = require("../repositories/paymentRepository");
const businessService_1 = require("../services/businessService");
const cardsService_1 = require("../services/cardsService");
const companyService_1 = require("../services/companyService");
const rechargeService_1 = require("../services/rechargeService");
function createRecharge(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cardId } = req.params;
            const apiKey = req.headers['x-api-key'];
            const { amount } = req.body;
            const company = yield (0, companyService_1.existCompanyByApiKey)(apiKey.toString());
            if (!company) {
                return res.status(401).send("Empresa não cadastrada!");
            }
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            const today = (0, dayjs_1.default)().format('MM/YY');
            const expired = yield (0, cardsService_1.isTodayTheExpirationDate)(today, card.expirationDate);
            if (expired) {
                return res.status(401).send("Cartão expirado");
            }
            if (!card.password) {
                return res.status(401).send("Cartão precisa estar ativado!");
            }
            yield (0, rechargeService_1.rechargeCard)(card, amount);
            res.status(200).send("Cartão recarregado com sucesso!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.createRecharge = createRecharge;
function buy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cardId } = req.params;
            const { password, businessId, amount } = req.body;
            const card = yield (0, cardsService_1.existCardById)(Number(cardId));
            if (!card) {
                return res.status(404).send("Cartão não cadastrado!");
            }
            if (!card.password) {
                return res.status(401).send("Cartão precisa estar ativado!");
            }
            const today = (0, dayjs_1.default)().format('MM/YY');
            const expired = yield (0, cardsService_1.isTodayTheExpirationDate)(today, card.expirationDate);
            if (expired) {
                return res.status(401).send("Cartão expirado");
            }
            if (card.isBlocked) {
                return res.status(401).send("Cartão bloqueado");
            }
            const validPassword = (0, cardsService_1.verifyPassword)(password, card.password);
            if (!validPassword) {
                return res.status(401).send("Senha incorreta!");
            }
            const business = yield (0, businessService_1.getBusinessById)(Number(businessId));
            if (!business) {
                return res.status(404).send("Estabelecimento não cadastrado!");
            }
            if (business.type !== card.type) {
                return res.status(401).send("Cartão não autorizado!");
            }
            const balance = yield (0, cardsService_1.getBalance)(card);
            if (balance.balance < amount) {
                return res.status(401).send("Saldo insuficiente!");
            }
            const paymentData = {
                cardId: card.id,
                businessId: businessId,
                amount: amount
            };
            yield (0, paymentRepository_1.insert)(paymentData);
            res.status(200).send("Compra realizada com sucesso!");
        }
        catch (error) {
            res.status(500).send("Algo deu errado! :(");
        }
    });
}
exports.buy = buy;
