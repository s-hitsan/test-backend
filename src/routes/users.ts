import { Response, Router } from 'express';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types';
import {
  CreateUserModel,
  DeleteUserModel,
  GetUserQueryModel,
  UpdateUserModel,
  URIParamUserIdModel,
  UserViewModel,
} from '../models';
import { usersRepository } from '../repositories/users-repository';

export const getUsersRouter = () => {
  const router = Router();

  router.get(
    '/',
    (
      req: RequestWithQuery<GetUserQueryModel>,
      res: Response<UserViewModel[]>,
    ) => {
      const foundUsers = usersRepository.getUsers(req.query.name);
      res.json(foundUsers);
    },
  );

  router.post(
    '/',
    (
      req: RequestWithBody<CreateUserModel>,
      res: Response<UserViewModel | { message: string }>,
    ) => {
      if (!req.body?.name?.trim()) {
        res.status(400).json({ message: 'Username cannot be empty' });
        return;
      }

      const newUser = usersRepository.addUser(req.body);
      res.status(201).json(newUser);
    },
  );

  router.put(
    '/:id',
    (
      req: RequestWithParamsAndBody<URIParamUserIdModel, UpdateUserModel>,
      res: Response<UserViewModel>,
    ) => {
      if (!req.body.name) {
        res.sendStatus(400);
        return;
      }
      const foundUser = usersRepository.findUserById(+req.params.id);

      if (!foundUser) {
        res.sendStatus(404);
        return;
      }
      usersRepository.setUserName(+req.params.id, req.body.name);

      res.json(foundUser);
    },
  );

  router.get('/:id', (req: RequestWithParams<URIParamUserIdModel>, res) => {
    const foundUser = usersRepository.findUserById(+req.params.id);
    if (!foundUser) {
      res.sendStatus(404);
      return;
    }
    res.json(foundUser);
  });

  router.delete('/:id', (req: RequestWithParams<DeleteUserModel>, res) => {
    usersRepository.deleteUser(+req.params.id);

    res.sendStatus(204);
  });

  return router;
};
