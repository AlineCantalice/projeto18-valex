"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardsController_1 = require("../controllers/cardsController");
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const activateCardSchema_1 = __importDefault(require("../schemas/cardSchemas/activateCardSchema"));
const blockUnblockCardSchema_1 = __importDefault(require("../schemas/cardSchemas/blockUnblockCardSchema"));
const cardSchema_1 = __importDefault(require("../schemas/cardSchemas/cardSchema"));
const router = (0, express_1.Router)();
router.post('/card/:employeeId', (0, validationMiddleware_1.default)(cardSchema_1.default), cardsController_1.createCard);
router.post('/activate/:cardId', (0, validationMiddleware_1.default)(activateCardSchema_1.default), cardsController_1.activateCard);
router.get('/balance/:cardId', cardsController_1.getCardBalance);
router.post('/block/:cardId', (0, validationMiddleware_1.default)(blockUnblockCardSchema_1.default), cardsController_1.blockCard);
router.post('/unblock/:cardId', (0, validationMiddleware_1.default)(blockUnblockCardSchema_1.default), cardsController_1.unblockCard);
exports.default = router;
