import { Router } from 'express';
import SessionController from './controllers/SessionController';

const routes = new Router;

routes.post('/session', SessionController.store);
routes.get('/session', SessionController.index);
routes.put('/session/:user_id', SessionController.update)

export default routes;