const express = require('express');
const app = express();
const joi = require('joi');
const bodyParser = require('body-parser');

var router = express.Router();
const uriencodedParser = bodyParser.urlencoded({ extended: false });

var file = require('fs');

app.use(bodyParser.json())
app.use('/css',express.static(__dirname + '/css'))
app.set('views', './views')
app.set('view engine', 'ejs')

const courseSchema = joi.object({
    course_name: joi.string().min(5).required(),
    course_code: joi.string().pattern(/^[a-zA-Z]{3}\d{3}$/).required(),
    desc:joi.string().max(200)
})




const studentSchema = joi.object({
    student_name: joi.string().pattern(/^[a-zA-Z-']+$/).required(),
    student_code: joi.string().pattern(/^[a-zA-Z\d]{7}$/).required(),
    
})


var courselist = [
    {
        id: 1,
        name: 'Multimedia',
        code: 'CSE412',
        description:"CSE412 - Multimedia"
    },
    {
        id: 2,
        name: 'Control System',
        code: 'CSE471',
        description:"CSE471 - Control System"
    },
    // {
    //     id: 3,
    //     name: 'Artificial Intelligence',
    //     code: 'CSE481',
    //     description:"CSE481 - Artificial Intelligence"
    // },
    // {
    //     id: 4,
    //     name: 'Image Processing',
    //     code: 'CSE464',
    //     description:"CSE464 - Image Processing"
    // },
    
];

var studentlist = [{ id: 1, name: 'Ayman-Mohamed-Saad', code: '14t0045' },
    { id: 2, name: 'Ahmed-Alaa\'-Mahmoud', code: '14t0046' },
    {id:3, name: 'Samir-Badr-Eldin', code: '14t0044' },
];
app.get('/', (req, res) => {
    res.send('Welcome to COURSES API.');
});


/* COURSES API */
app.get('/api/courses', (req, res) => {
    res.json(courselist);
   // res.json(req.body)
});


app.get('/api/courses/:id', (req, res) => {
    var single_course = courselist.find(c => c.id === parseInt(req.params.id));
    if(!single_course)res.status(404).send('The course with the given ID not found ')
    res.send(single_course);
});


app.post('/api/courses',uriencodedParser, (req, res) => {
    //res.send(courselist);
    //res.json(req.body.course_name)
    
    const result = courseSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    courselist.push({
        id: courselist.length + 1,
        name: req.body.course_name,
        code: req.body.course_code,
        description:req.body.desc
    })
    res.status(200).json({
        message: 'course added successful',
        course_list: courselist
    })
});


app.put('/api/courses/:id',uriencodedParser, (req, res) => {
    //res.send(courselist);
    //res.json(req.body.course_name)
  
    var single_course = courselist.find(c => c.id === parseInt(req.params.id));
    if(!single_course)res.status(404).send('The course with the given ID not found ')
    
    const result = courseSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    single_course.name = req.body.course_name;
    single_course.code = req.body.course_code;
    single_course.description = req.body.desc;
  
    res.status(200).json({ message: 'course updated successful' ,
    course_list: courselist});
});

app.delete('/api/courses/:id',uriencodedParser, (req, res) => {
    //res.send(courselist);
    //res.json(req.body.course_name)
  
    var single_course = courselist.find(c => c.id === parseInt(req.params.id));
    if(!single_course)res.status(404).send('The course with the given ID not found ')
    
    // const result = joi.valid(req.body, courseSchema)
    // if (result.error) {
    //     res.status(400).send(result.error.detail[0]);
    //     return;
    // }

    const index = courselist.indexOf(single_course);
    courselist.splice(index, 1);
    
  
    res.status(200).json({ message: 'course deleted successful',
    course_list: courselist });
});

// STUDENTS API
app.get('/api/students', (req, res) => {
    res.send(studentlist);
});

app.get('/api/students/:id', (req, res) => {
    var single_student = studentlist.find(c => c.id === parseInt(req.params.id));
    if(!single_student)res.status(404).send('The student with the given ID not found ')
    res.send(single_student);
});

app.post('/api/students',uriencodedParser, (req, res) => {
    //res.send(courselist);
    //res.json(req.body.course_name)
    
    const result = studentSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    studentlist.push({
        id: studentlist.length + 1,
        name: req.body.student_name,
        code: req.body.student_code,
       
    })
    res.status(200).json({ message: 'student added successful',
    student_list: studentlist })
});


app.put('/api/students/:id',uriencodedParser, (req, res) => {
    //res.send(courselist);
    //res.json(req.body.course_name)
  
    var single_student = studentlist.find(s=> s.id === parseInt(req.params.id));
    if(!single_student)res.status(404).send('The student with the given ID not found ')
    
    const result = studentSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    single_student.name = req.body.student_name;
    single_student.code = req.body.student_code;
    
  
    res.status(200).json({ message: 'student updated successful',
    student_list: studentlist });
});

app.delete('/api/students/:id',uriencodedParser, (req, res) => {
    
    var single_student = studentlist.find(s => s.id === parseInt(req.params.id));
    if(!single_student)res.status(404).send('The student with the given ID not found ')

    const index = studentlist.indexOf(single_student);
    studentlist.splice(index, 1);

    res.status(200).json({ message: 'student deleted successful',
    student_list: studentlist });
});



// COURSES FORM
app.get( '/web/courses/create', (req, res) => {
    res.render('course_form');
});


// STUDENTS FORM
app.get( '/web/students/create', (req, res) => {
    res.render('student_form');
});


// DISPLAY SOURCE CODE 
app.get( '/web/sourcecode', (req, res) => {
    // res.sendFile(__dirname + '/index.js');
    file.readFile(__dirname+'/index.js', (err, html) => {
        res.write(html)
        res.end()
    })
});



const port = process.env.PORT || 3000;
const host = '0.0.0.0';
app.listen(port,host, () =>
    console.log(`listen on ${port} ,,,`)
);