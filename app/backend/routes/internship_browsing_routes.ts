import { Router } from 'express';
import { InternshipBrowsingController } from '../controllers/internship_browsing_controller';

export const search_internships_route = Router();

search_internships_route.get('/', (req, res) => {
    new InternshipBrowsingController(req,res).handle();
});