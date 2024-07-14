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
import { usersService } from '../domain/users-service';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares';
import { HTTP_REQUESTS } from '../constants';

export const getUsersRouter = () => {
  const router = Router();

  router.get(
    '/',
    async (req: RequestWithQuery<GetUserQueryModel>, res: Response<UserViewModel[]>) => {
      const foundUsers = await usersService.getUsers(req.query.name, req.query.skip);
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
    async (
      req: RequestWithBody<CreateUserModel>,
      res: Response<UserViewModel | { message: string | {} }>,
    ) => {
      const newUser = await usersService.addUser(req.body);
      if (newUser) {
        res.status(201).json(newUser);
        return;
      }
      res.status(HTTP_REQUESTS.BAD_REQUEST_400).json({ message: 'Input data is wrong!' });
    },
  );

  router.put(
    '/:id',
    nameValidation,
    inputValidationMiddleware,
    async (
      req: RequestWithParamsAndBody<URIParamUserIdModel, UpdateUserModel>,
      res: Response<UserViewModel | { message: string | {} }>,
    ) => {
      const foundUser = await usersService.findUserById(+req.params.id);

      if (!foundUser) {
        res.sendStatus(404);
        return;
      }
      await usersService.setUserName(+req.params.id, req.body.name);

      res.sendStatus(201);
    },
  );

  router.get('/:id', async (req: RequestWithParams<URIParamUserIdModel>, res) => {
    const foundUser = await usersService.findUserById(+req.params.id);
    if (!foundUser) {
      res.sendStatus(404);
      return;
    }
    res.json(foundUser);
  });

  router.delete('/:id', async (req: RequestWithParams<DeleteUserModel>, res) => {
    await usersService.deleteUser(+req.params.id);

    res.sendStatus(204);
  });

  return router;
};
