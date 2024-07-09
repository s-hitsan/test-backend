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
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares';

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

  const nameValidation = body('name')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Name is required');

  router.post(
    '/',
    nameValidation,
    body('email').isEmail().withMessage('Wrong email address'),
    inputValidationMiddleware,
    (
      req: RequestWithBody<CreateUserModel>,
      res: Response<UserViewModel | { message: string | {} }>,
    ) => {
      const newUser = usersRepository.addUser(req.body);
      res.status(201).json(newUser);
    },
  );

  router.put(
    '/:id',
    nameValidation,
    inputValidationMiddleware,
    (
      req: RequestWithParamsAndBody<URIParamUserIdModel, UpdateUserModel>,
      res: Response<UserViewModel | { message: string | {} }>,
    ) => {
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
