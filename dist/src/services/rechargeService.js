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
exports.rechargeCard = exports.getRechargesByCardId = void 0;
const rechargeRepository_1 = require("../repositories/rechargeRepository");
function getRechargesByCardId(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, rechargeRepository_1.findByCardId)(cardId);
    });
}
exports.getRechargesByCardId = getRechargesByCardId;
function rechargeCard(card, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const rechargeData = {
            cardId: card.id,
            amount: amount
        };
        yield (0, rechargeRepository_1.insert)(rechargeData);
    });
}
exports.rechargeCard = rechargeCard;
