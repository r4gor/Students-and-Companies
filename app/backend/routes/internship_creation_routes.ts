import { Router } from 'express';
import { InternshipCreationController } from '../controllers/internship_creation_controller';

export const create_internship_route = Router();

create_internship_route.get('/', (req, res) => {
    new InternshipCreationController(req,res).handle();
});