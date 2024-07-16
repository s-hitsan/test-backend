import { Response, Router } from 'express';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares';
import { HTTP_REQUESTS } from '../constants';
import { aidsRepository } from '../repositories/aids-repository';
import {
  AidViewModel,
  CreateAidModel,
  DeleteAidModel,
  GetAidQueryModel,
  UpdateAidDTitleModel,
  URIParamAidIdModel,
} from '../models/aids';
import { aidsService } from '../domain/aids-service';

export const getAidsRouter = () => {
  const router = Router();

  router.get(
    '/',
    async (req: RequestWithQuery<GetAidQueryModel>, res: Response<AidViewModel[]>) => {
      const foundAids = await aidsService.getAids(req.query.title, req.query.skip);
      res.json(foundAids);
    },
  );

  router.get('/total-count', async (req, res: Response<number>) => {
    const aidsTotalCount = await aidsRepository.getAidsTotalCount();
    res.json(aidsTotalCount);
  });

  const aidValidation = body(['title', 'description', 'sum', 'link'])
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Fields are required');

  const titleValidation = body('title')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Title is required');

  router.post(
    '/',
    aidValidation,
    inputValidationMiddleware,
    async (
      req: RequestWithBody<CreateAidModel>,
      res: Response<AidViewModel | { message: string | {} }>,
    ) => {
      const newAid = await aidsService.addAid(req.body);
      if (newAid) {
        res.status(201).json(newAid);
        return;
      }
      res.status(HTTP_REQUESTS.BAD_REQUEST_400).json({ message: 'Input data is wrong!' });
    },
  );

  router.put(
    '/:id',
    titleValidation,
    inputValidationMiddleware,
    async (
      req: RequestWithParamsAndBody<URIParamAidIdModel, UpdateAidDTitleModel>,
      res: Response<AidViewModel | { message: string | {} }>,
    ) => {
      const foundAid = await aidsService.findAidById(+req.params.id);

      if (!foundAid) {
        res.sendStatus(404);
        return;
      }
      await aidsService.setAidTitle(+req.params.id, req.body.title);

      res.sendStatus(201);
    },
  );

  router.get('/:id', async (req: RequestWithParams<URIParamAidIdModel>, res) => {
    const foundAid = await aidsService.findAidById(+req.params.id);
    if (!foundAid) {
      res.sendStatus(404);
      return;
    }
    res.json(foundAid);
  });

  router.delete('/:id', async (req: RequestWithParams<DeleteAidModel>, res) => {
    await aidsService.deleteAid(+req.params.id);

    res.sendStatus(204);
  });

  return router;
};
