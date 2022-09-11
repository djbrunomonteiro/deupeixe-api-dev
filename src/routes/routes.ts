import { Router } from "express";
import AuthController from '../controllers/Authcontroller';
import UserController from '../controllers/UserController';
import {guard} from '../middlewares/guard'


const routes = Router();

routes.get('/login', AuthController.login);
routes.post('/logingoogle', AuthController.loginGoogle);
routes.post('/sign_up', AuthController.register);

routes.use(guard);

routes.get('/user/:id', UserController.getOne);

export default routes;