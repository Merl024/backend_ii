import * as coursesService from '../services/factory.js';

export async function getAllCourses(req, res){
    try {
        let courses = await coursesService.getAll()        
        res.status(200).send(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function saveCourse(req, res){
    try {
        // Por el momento no se valida nada, pero se puede hacer
        let courses = await coursesService.save(req.body); 
        res.status(201).send(courses);        
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).json({ error: 'Internal Server Error' });   
    }
}