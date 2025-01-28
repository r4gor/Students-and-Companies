import { Router } from 'express';
import FeedbackController from '../controllers/feedbacks_controller';

export const feedbacks_route = Router();

feedbacks_route.get('/fetch', (req, res) => {
    new FeedbackController(req, res).fetch_feedback_questions();
});

feedbacks_route.post('/post', (req, res) => {
    new FeedbackController(req, res).post_feedback();
})


