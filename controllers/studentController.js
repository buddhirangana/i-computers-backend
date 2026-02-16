import Student from '../models/student.js';

export function createStudent(req, res) {
   
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized Access you need to login befor creating a student"
        })
        return; // Stop further execution of the function
    }

    if (req.user.isAdmin == false) {
        res.status(403).json({
            message: "Only admin can create a student"
        })
        return;
    }



    const newStudent = new Student(
        {
            name: req.body.name,
            age: req.body.age,
            city: req.body.city
        }
    )

    newStudent.save().then(() => {
		res.json({
			message: "Student Created Successfully",
		});
	}).catch((error) => {
		console.error("Error creating student:", error);
	});
}

export function getStudents(req, res) {
    Student.find().then((students) => {
        res.json(students)
    })
}