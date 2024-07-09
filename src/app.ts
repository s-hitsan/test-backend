import express from 'express';

import { getUsersRouter } from './routes/users';
import { getTestsRouter } from './routes/tests';
import bodyParser from 'body-parser';

export const app = express();

app.use(bodyParser.json());

app.use('/users', getUsersRouter());
app.use('/__test__', getTestsRouter());
