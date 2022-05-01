const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');
const dbConnection = require('../database/mySQLconnect');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/

const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'What is up?';
});

/*File Upload */
const multer = require('@koa/multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Uploads')
    },
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`)
    }
})


const upload = multer({storage})
router.post(
    '/upload',
    upload.fields([
        {
            name: 'file',
            maxCount: 1
        },
        {
            name: 'text',
            maxCount: 1
        }
    ]),
    ctx => {
        // console.log('ctx.request.files', ctx.request.files);
        // console.log('ctx.files', ctx.files);
        // console.log(`ctx.request.body ${JSON.stringify(JSON.parse(ctx.request.body.text))}`);
        // console.log(`path ${typeof ctx.request.files.file[0].path}`);
        ctx.body = 'done';
        const syllabusTableAttributes = [
            'student_id',
            'from_school',
            'from_title',
            'from_subject',
            'from_catalog',
            'from_semester',
            'from_year',
            'syllabus_file_path',
            'syllabus_url',
            'course_key'

        ]

        let valuesFromRequest = JSON.parse(JSON.parse(JSON.stringify(ctx.request.body.text)));
        const syllabus_url = (valuesFromRequest.syllabus_url === undefined) ? null : `${valuesFromRequest.syllabus_url}`;
        const syllabus_file_path = (valuesFromRequest.syllabus_file_path === null) ? null : `${ctx.files.file[0].path.replace('\\', '\\\\')}`;
        const valuesToInsert = {
            ...valuesFromRequest,
            syllabus_file_path: syllabus_file_path,
            syllabus_url: syllabus_url
        }



        console.log(`API server::upload after having added default values: ${JSON.stringify(valuesToInsert)}`);

        const valueMarkers = Array(syllabusTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = syllabusTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);
        console.log(`attributeValuesArray is : ${attributeValuesArray}`);
        return new Promise((resolve, reject) => {
            console.log(syllabus_file_path.replace('\\', '\\\\'));

            const query = `INSERT INTO syllabus_for_courses (${syllabusTableAttributes}) VALUES (${valueMarkers})  
            ON DUPLICATE KEY UPDATE 
            from_school = '${valuesFromRequest.from_school}',
            from_title = '${valuesFromRequest.from_title}',
            from_subject = '${valuesFromRequest.from_subject}',
            from_catalog = '${valuesFromRequest.from_catalog}',
            from_semester = '${valuesFromRequest.from_semester}',
            from_year = '${valuesFromRequest.from_year}',
            syllabus_file_path = '${syllabus_file_path}',
            syllabus_url = '${syllabus_url}'
                             
                                `;
            dbConnection.query({
                sql: query,
                values: attributeValuesArray
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransferController::insertCurrentCourse", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });


        })
            .catch(error => console.log(`studentSessionCourses failed with error message, ${error}`));
    }
);



/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/


const LoginController = new (require('../app/Controllers/LoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});



loginRouter.get('/:student_id', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));
loginRouter.post('/generate-token', LoginController.generateTokenForStudent);
loginRouter.get('/:studentID/get-student-token', LoginController.getStudentToken);

const SyllabusController = new (require('../app/Controllers/SyllabusController.js'))();
const syllabusRouter = require('koa-router')({
    prefix: '/syllabus'
})

syllabusRouter.post('/insert-syllabus-url', SyllabusController.addSyllabusURL);
syllabusRouter.get('/:courseKey/get-syllabus-url', SyllabusController.getSyllabusURL);


const downloadRouter = require('koa-router')({
    prefix: '/download'
});

downloadRouter.get('/:courseKey/get-syllabus', SyllabusController.getSyllabus);



const advisorLoginController = new (require('../app/Controllers/advisorLoginController.js'))();
const advisorLoginRouter = require('koa-router')({
    prefix: '/advisor-login'
});

advisorLoginRouter.get('/:advisor_id', advisorLoginController.authorizeUser, (err) => console.log("router.js: advisorLoginRouter error:", err));

const TransferController = new (require('../app/Controllers/TransferController.js'))();
const transferRouter = require('koa-router')({
    prefix: '/transfer'
});

const CourseController = new (require('../app/Controllers/CourseController.js'))();
const courseRouter = require('koa-router')({
    prefix: '/courses'
});

transferRouter.use(VerifyJWT);
transferRouter.get('/:studentID/transfer-courses', Authorize('student'), TransferController.transferCourses);
transferRouter.get('/:studentID/enrollment', Authorize('student'), TransferController.enrollment);
transferRouter.get('/:studentID/test-credit-courses', Authorize('student'), TransferController.testCreditCourses);
transferRouter.get('/:studentID/arr-update-form', Authorize('student'), TransferController.arrUpdateForm);
transferRouter.get('/:studentID/nonarticulated-courses', Authorize('student'), TransferController.transferCoursesNonArticulated);
transferRouter.get('/:studentID/:subject/major-articulated-courses', Authorize('student'), TransferController.majorCourses);
transferRouter.post('/insert-current-course', Authorize('student'), TransferController.insertCurrentCourse);
transferRouter.post('/insert-additional-course', Authorize('student'), TransferController.insertAdditionalCourse);
transferRouter.post('/update-student-course', Authorize('student'), TransferController.updateStudentCourses);
transferRouter.post('/student-session-courses', Authorize('student'), TransferController.studentSessionCourses);
transferRouter.get('/:studentID/get-current-courses', Authorize('student'), TransferController.getCurrentCourses);
transferRouter.get('/:studentID/get-additional-courses', Authorize('student'), TransferController.getAdditionalCourses);
transferRouter.get('/:studentID/get-session-courses', Authorize('student'), TransferController.getSessionCourses);
transferRouter.get('/:studentID/eligible', Authorize('student'), TransferController.eligible);
transferRouter.post('/save-eligible-courses', Authorize('student'), TransferController.saveEligibleCourses);
transferRouter.get('/:studentID/clear-eligible', Authorize('student'), TransferController.clearEligible);
transferRouter.get('/:studentID/eligible-saved', Authorize('student'), TransferController.eligibleSaved);
transferRouter.get('/:studentID/matched-courses', Authorize('student'), TransferController.getMatchedCourses);


courseRouter.use(VerifyJWT);
courseRouter.get('/cs/course-catalog', Authorize('student'), CourseController.computerScienceCourses);
courseRouter.get('/:subject/course-catalog', Authorize('student'), CourseController.coursesBySubject);
courseRouter.get('/:subject/:catalog/course-by-subject-catalog', Authorize('student'), CourseController.courseBySubjectAndCatalog);
courseRouter.get('/cs/course-catalog', Authorize('student'), CourseController.computerScienceCourses);
courseRouter.get('/:subject/course-catalog', Authorize('student'), CourseController.coursesBySubject);
courseRouter.get('/cs/course-catalog-all', Authorize('student'), CourseController.computerScienceCoursesAll);


const advisorStudentsController = new (require('../app/Controllers/advisorStudentsController.js'))();
const advisorStudentsRouter = require('koa-router')({
    prefix: '/advisor-students'
});

advisorStudentsRouter.use(VerifyJWT);
advisorStudentsRouter.get('/:advisorID/new-transfer-students', Authorize('admin'), advisorStudentsController.newTransferStudents);
advisorStudentsRouter.get('/:studentID/student-email-info', Authorize('admin'), advisorStudentsController.studentEmailInfo);
advisorStudentsRouter.get('/:studentID/get-student-info', Authorize('student'), advisorStudentsController.getStudentInfo)

const EmailController = new (require('../app/Controllers/EmailController.js'))();
const EmailRouter = require('koa-router')({
    prefix: '/email'
});

EmailRouter.use(VerifyJWT);
EmailRouter.post('/send-email', Authorize('student'), EmailController.email);

const caseController = new (require('../app/Controllers/CaseController.js'))();
const caseRouter = require('koa-router')({
    prefix: '/student-cases'
});

caseRouter.use(VerifyJWT);
caseRouter.post('/add-case', Authorize('student'), caseController.insertNewCase);
caseRouter.get('/:advisorID/active-cases', Authorize('admin'), caseController.activeCases);
caseRouter.get('/:studentID/case-by-student-id', Authorize('student'), caseController.getCaseByStudentID)
/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    transferRouter.routes(),
    courseRouter.routes(),
    advisorLoginRouter.routes(),
    EmailRouter.routes(),
    advisorStudentsRouter.routes(),
    caseRouter.routes(),
    downloadRouter.routes(),
    syllabusRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
