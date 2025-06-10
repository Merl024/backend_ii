// La idea es que se comunique con un controlador
import { Router } from 'express';
import * as StudentsController from '../controller/studentController.js'

const router = Router();

router.get('/', StudentsController.getAllStudents);
router.post('/', StudentsController.saveStudent);

export default router