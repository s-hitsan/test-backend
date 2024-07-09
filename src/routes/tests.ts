import { Router } from 'express';
import { HTTP_REQUESTS } from '../constants';
import { usersRepository } from '../repositories/users-repository';

export const getTestsRouter = () => {
  const router = Router();
  router.delete('/data', (req, res) => {
    usersRepository.clearUsers();
    res.sendStatus(HTTP_REQUESTS.OK_200);
  });
  return router;
};
