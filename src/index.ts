import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { client } from './database/client';
import { indexRouter } from './routes';
import exceptionHandler from './middlewares/exceptionHandlers';
import { createDefaultAdmin } from './scripts/createDefaultAdmin';
import { importMovies } from './scripts/importMovies';
import logger from './utils/logger';

dotenv.config();

export const app: Express = express();
app.use(express.json());
app.use(morgan('tiny'));

client.$connect().then(async () => {
  logger.info('Successfully Connected to Database.');
  await createDefaultAdmin();
  await importMovies();
});


app.use(indexRouter);
app.use(exceptionHandler);

const port = process.env.PORT;
app.listen(port, () => {
  logger.info(`The server is running on port " ${port}"`);
});
