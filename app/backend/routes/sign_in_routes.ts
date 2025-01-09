import { Router } from 'express';

export const sign_in_route = Router();

sign_in_route.get('/', (req, res) => {
  res.send("What's up doc ?!");
});
