import express from 'express';
import { getStudents, createStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get("/", getStudents)
studentRouter.post("/", createStudent)

export default studentRouter;