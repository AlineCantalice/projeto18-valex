"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const rechargeSchema = joi_1.default.object({
    amount: joi_1.default.number().integer().positive().min(1).required()
});
exports.default = rechargeSchema;
