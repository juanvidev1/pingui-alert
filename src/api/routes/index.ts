import { Hono } from 'hono';
import { ApiController, MetricsController } from '../controllers/index.js';
import { verifyJwtToken, validateRateLimit, validateStatus, verifyTemporalToken } from '../../middlewares/index.js';

// Validators
import { zValidator } from '@hono/zod-validator';
import { memberActiveUpdateSchema } from '../../validators/index.js';

const apiRouter = new Hono().basePath('/api');

apiRouter.get('/metrics/daily', MetricsController.getMetrics);

apiRouter.post('/temporal-token', ApiController.createTemporalToken);

apiRouter.post('/alert', verifyJwtToken, validateRateLimit, validateStatus, ApiController.alert);

apiRouter.post('/alert/members', verifyJwtToken, validateRateLimit, validateStatus, ApiController.alertMembers);

apiRouter.post(
  '/change-member-status',
  verifyJwtToken,
  zValidator('json', memberActiveUpdateSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: 'Validation failed',
          causes: JSON.parse(result.error.message).map((err: any) => {
            return {
              code: err.code,
              expected: err.expected,
              message: err.message
            };
          })
        },
        400
      );
    }
  }),
  ApiController.changeActiveMember
);

apiRouter.post('/createIntegration', verifyTemporalToken, ApiController.createIntegration);

apiRouter.get('/integrations/:chatId', verifyJwtToken, ApiController.integrations);

apiRouter.post('/updateRateLimit', verifyJwtToken, ApiController.updateRateLimit);

apiRouter.post('/revokeIntegration', verifyJwtToken, ApiController.revokeIntegration);

apiRouter.get('/integration-members', verifyJwtToken, ApiController.getIntegrationMembers);

apiRouter.get('/health', (c) => c.json({ status: 'OK' }));

export default apiRouter;
