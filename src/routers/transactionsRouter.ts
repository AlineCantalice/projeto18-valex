import { Router } from "express";
import { buy, createRecharge } from "../controllers/transactionsController";
import apiKeyValidate from "../middlewares/apiKeyValidationMiddleware";
import validateSchema from "../middlewares/validationMiddleware";
import buySchema from "../schemas/transactionSchemas/buySchema";
import rechargeSchema from "../schemas/transactionSchemas/rechargeSchema";

const router = Router();

router.post('/recharge/:cardId', apiKeyValidate, validateSchema(rechargeSchema), createRecharge);
router.post('buy/:cardId', validateSchema(buySchema), buy);

export default router;