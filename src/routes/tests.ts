import { Router } from 'express';
import { HTTP_REQUESTS } from '../constants';
import { usersService } from '../domain/users-service';

export const getTestsRouter = () => {
  const router = Router();
  router.delete('/data', async (req, res) => {
    await usersService.clearUsers();
    res.sendStatus(HTTP_REQUESTS.OK_200);
  });
  return router;
};
