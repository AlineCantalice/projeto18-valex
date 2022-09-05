import { Router } from "express";
import { activateCard, blockCard, createCard, getCardBalance, unblockCard } from "../controllers/cardsController";
import apiKeyValidate from "../middlewares/apiKeyValidationMiddleware";
import validateSchema from "../middlewares/validationMiddleware";
import activateSchema from "../schemas/cardSchemas/activateCardSchema";
import blockUnblockSchema from "../schemas/cardSchemas/blockUnblockCardSchema";
import cardSchema from "../schemas/cardSchemas/cardSchema";

const router = Router();

router.post('/card/:employeeId', apiKeyValidate, validateSchema(cardSchema), createCard);
router.post('/activate/:cardId', validateSchema(activateSchema), activateCard);
router.get('/balance/:cardId', getCardBalance);
router.post('/block/:cardId', validateSchema(blockUnblockSchema), blockCard);
router.post('/unblock/:cardId', validateSchema(blockUnblockSchema), unblockCard);

export default router;