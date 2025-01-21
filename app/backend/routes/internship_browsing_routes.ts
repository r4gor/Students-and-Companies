import { Router } from 'express';
import { InternshipBrowsingController } from '../controllers/internship_browsing_controller';

export const search_internships_route = Router();

search_internships_route.get('/query/', (req, res) => {
    new InternshipBrowsingController(req,res).handle();
});

search_internships_route.get('/tags/', (req, res) => {
    new InternshipBrowsingController(req,res).handle();
});