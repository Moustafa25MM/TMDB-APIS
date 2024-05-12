import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { client } from './database/client';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan('tiny'));

client.$connect().then(() => {
  console.log('Successfully Connected to Database.');
});


app.use('/', (req: Request, res: Response) => {
  return res.status(200).send('Hello from Node TS');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on port " ${port}"`);
});
