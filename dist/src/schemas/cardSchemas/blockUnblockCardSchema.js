"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const blockUnblockSchema = joi_1.default.object({
    password: joi_1.default.string().regex(/^\d+$/).length(4).required()
});
exports.default = blockUnblockSchema;
