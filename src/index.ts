import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { client } from './database/client';
import { indexRouter } from './routes';
import exceptionHandler from './middlewares/exceptionHandlers';
import { createDefaultAdmin } from './scripts/createDefaultAdmin';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan('tiny'));

client.$connect().then(() => {
  createDefaultAdmin();
  console.log('Successfully Connected to Database.');
});


app.use(indexRouter);
app.use(exceptionHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on port " ${port}"`);
});
