import { Router } from "express";
import { activateCard, blockCard, createCard, getCardBalance, getCardByEmployee, unblockCard } from "../controllers/cardsController";

const router = Router();

router.post('/card/:employeeId', createCard);
router.post('/activate/:cardId', activateCard);
//router.get('/card', getCardByEmployee);
router.get('/balance/:cardId', getCardBalance);
router.post('/block/:cardId', blockCard);
router.post('/unblock/:cardId', unblockCard);

export default router;