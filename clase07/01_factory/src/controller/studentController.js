/* El controlador le pide al servicio que le traiga los estudiantes */
import { studentService } from '../services/factory.js';
import StudentDTO from '../services/dto/student.dto.js';

export async function getAllStudents(req, res){
    try {
        let students = await studentService.getAll()
        res.send(students);        
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export async function saveStudent(req, res){
    try {
        const studentDTO = new StudentDTO(req.body) // Moldea la info antes de pasarla a la base de datos
        let result = await studentService.save(studentDTO)
        res.status(201).send(result);
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
