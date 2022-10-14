import { Router } from "express";
import AuthController from '../controllers/Authcontroller';
import TankController from "../controllers/TankController";
import UserController from '../controllers/UserController';
import {guard} from '../middlewares/guard'


const routes = Router();


routes.get('/login', AuthController.login);
routes.post('/logingoogle', AuthController.loginGoogle);
routes.post('/sign_up', AuthController.register);
routes.post('/validation', AuthController.validationToken);

routes.use(guard);

routes.get('/tank', TankController.getAll);

routes.get('/tank/:id', TankController.getOne);

routes.post('/tank', TankController.createOne);

routes.get('/user/:id', UserController.getOne);

export default routes;