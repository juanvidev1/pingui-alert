import { Hono } from 'hono';
import { ApiController, MetricsController } from '../controllers/index.js';
import { verifyJwtToken, validateRateLimit, validateStatus, verifyTemporalToken } from '../../middlewares/index.js';

const apiRouter = new Hono().basePath('/api');

apiRouter.get('/metrics', MetricsController.getMetrics);

apiRouter.post('/temporal-token', ApiController.createTemporalToken);

apiRouter.post('/alert', verifyJwtToken, validateRateLimit, validateStatus, ApiController.alert);

apiRouter.post('/createIntegration', verifyTemporalToken, ApiController.createIntegration);

apiRouter.get('/integrations/:chatId', verifyJwtToken, ApiController.integrations);

apiRouter.post('/updateRateLimit', verifyJwtToken, ApiController.updateRateLimit);

apiRouter.post('/revokeIntegration', verifyJwtToken, ApiController.revokeIntegration);

export default apiRouter;
