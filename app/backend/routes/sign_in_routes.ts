import { Router } from 'express';
import {SignInController} from '../controllers/sign_in_controller'

export const router = Router();

router.get('/signin', (req, res) => {
  new SignInController(req,res).handle();
});
