import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handleErrorMiddleware from './middlewares/handleErrorMiddleware';
import cardRouter from './routers/cardsRouter';
import transactionRouter from './routers/transactionsRouter';

dotenv.config();

const app = express();

app.use(cors(), express.json());

app.use(cardRouter);
app.use(transactionRouter);

app.use(handleErrorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});