const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

let count = 0;

class CourseController {
    constructor() {
        console.log('Constructor of CourseController is called.');
    }


    async computerScienceCourses(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT * FROM course_catalog WHERE (subject = 'CS' 
                        AND (catalog = '115' OR catalog = '210' OR catalog = '215' OR catalog = '242' OR catalog = '252') OR
                        (subject = 'math' and catalog = '161'))
                        `;
            dbConnection.query({
                sql: query,
                values: []
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::computerScienceCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async computerScienceCoursesAll(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT * 
                       FROM course_catalog 
                       WHERE subject = 'CS'
                       OR subject = 'MATH'
                       OR (subject = 'PHYS' AND catalog = '214')
                        `;
            dbConnection.query({
                sql: query,
                values: []
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::computerScienceCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async coursesBySubject(ctx) {
        /* Pulls only lower division courses */
        console.log(`coursesBySubject is called`)
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            course_catalog 
                        WHERE
                            subject = ?  
                            and catalog < 300           
                        ORDER BY 
                            catalog
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::coursesBySubject", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async courseBySubjectAndCatalog(ctx) {
        console.log(`coursesBySubject is called`)
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            course_catalog 
                        WHERE
                            subject = ?  
                            and catalog ?           
                      
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.subject, ctx.params.catalog]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::coursesBySubject", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = CourseController;
