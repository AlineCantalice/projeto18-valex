"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const buySchema = joi_1.default.object({
    password: joi_1.default.string().regex(/^\d+$/).length(4).required(),
    businessId: joi_1.default.number().positive().required(),
    amount: joi_1.default.number().integer().positive().min(1).required()
});
exports.default = buySchema;
