import { Router } from 'express';
import {SignInController} from '../controllers/sign_in_controller'

export const sign_in_route = Router();

sign_in_route.post('/', (req, res) => {
  new SignInController(req,res).handle();
});
