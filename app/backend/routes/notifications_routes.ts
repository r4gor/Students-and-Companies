import { Router } from 'express';
import {NotificationController} from '../controllers/notifications_controller'

export const notifications_route = Router();

notifications_route.get('/fetch/:email', (req, res) => {
    new NotificationController(req, res).fetch();
});

notifications_route.post('/post_notifications', (req, res) => {
    new NotificationController(req, res).post();
});

