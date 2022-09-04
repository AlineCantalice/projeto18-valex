import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handleErrorMiddleware from './middlewares/handleErrorMiddleware';
import router from './routers/cardsRouter';

dotenv.config();

const app = express();

app.use(cors(), express.json());

app.use(router);

app.use(handleErrorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});