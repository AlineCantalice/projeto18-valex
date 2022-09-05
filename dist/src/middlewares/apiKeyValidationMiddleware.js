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
const companyService_1 = require("../services/companyService");
function apiKeyValidate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey.toString()) {
            throw {
                status: 401,
                message: "ApiKey não encontrada!"
            };
        }
        const company = yield (0, companyService_1.existCompanyByApiKey)(apiKey.toString());
        res.locals.company = company;
        next();
    });
}
exports.default = apiKeyValidate;
