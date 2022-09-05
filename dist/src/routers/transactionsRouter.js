"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const apiKeyValidationMiddleware_1 = __importDefault(require("../middlewares/apiKeyValidationMiddleware"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const buySchema_1 = __importDefault(require("../schemas/transactionSchemas/buySchema"));
const rechargeSchema_1 = __importDefault(require("../schemas/transactionSchemas/rechargeSchema"));
const router = (0, express_1.Router)();
router.post('/recharge/:cardId', apiKeyValidationMiddleware_1.default, (0, validationMiddleware_1.default)(rechargeSchema_1.default), transactionsController_1.createRecharge);
router.post('/buy/:cardId', (0, validationMiddleware_1.default)(buySchema_1.default), transactionsController_1.buy);
exports.default = router;
