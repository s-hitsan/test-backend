import express from 'express';
import cors from 'cors';

import { getUsersRouter } from './routes/users';
import { getTestsRouter } from './routes/tests';
import bodyParser from 'body-parser';
import { getAidsRouter } from './routes/aids';

export const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/users', getUsersRouter());
app.use('/aids', getAidsRouter());
app.use('/__test__', getTestsRouter());
