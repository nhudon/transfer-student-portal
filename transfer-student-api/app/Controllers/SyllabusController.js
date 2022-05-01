const dbConnection = require('../../database/mySQLconnect');
const fs = require('fs');
const path = require("path");

require('dotenv').config();

class SyllabusController {
    async getSyllabus(ctx) {
        return new Promise((resolve, reject) => {

            console.log('SyllabusController::getSyllabus is called');

            let query = `SELECT syllabus_file_path FROM syllabus_for_courses WHERE course_key = ?`;
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.courseKey]
                }, (error, tuples) => {
                    if (error) {
                        console.log("Query error.", error);
                        return reject(`Query error. Error msg: error`);
                    }
                    if (tuples.length === 1) {  // Did we have a matching user record?
                        console.log('Path for syllabus: ', tuples[0]);

                        let path = require('path')
                        let file = path.join(__dirname, '..', '..', tuples[0].syllabus_file_path);
                        let filename = tuples[0].syllabus_file_path.substr(tuples[0].syllabus_file_path.indexOf('\\') + 1)

                        ctx.attachment(filename);
                        ctx.type =
                            'application/pdf';

                        const stream = fs.createReadStream(file);
                        console.log(`${JSON.stringify(stream)}`);
                        ctx.body = stream;

                        // {
                        //     status: "OK",
                        //     file: stream,
                        // };
                    } else {
                        console.log('No syllabus found.');
                        return reject('No syllabus found.');
                    }
                    return resolve();
                }
            )
        }).catch(err => {
            console.log('authorize in LoginController threw an exception. Reason...', err);
            ctx.status = 200;
            ctx.body = {
                status: "Failed",
                error: err,
                user: null
            };
        });

    }


    async getSyllabusURL(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT syllabus_url FROM syllabus_for_courses WHERE course_key = ?;
                      
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.courseKey]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::getCurrentCourses", error);
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

    async addSyllabusURL(ctx){
        console.log(`SyllabusController::addSyllabusURL is called`)
        console.log(`${JSON.stringify(ctx.request.body)}`);
        const sessionCourseTableAttributes = [

            'student_id',
            'from_year',
            'from_title',
            'from_catalog',
            'from_subject',
            'from_semester',
            'from_school',
            'syllabus_url',
            'course_key'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
        }

        console.log(`API server::addSyllabusURL after having added default values: ${JSON.stringify(valuesToInsert)}`);

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);
        console.log(`attributeValuesArray is : ${attributeValuesArray}`);

        return new Promise((resolve, reject) => {
            console.log(`API server::addSyllabusURL: ${JSON.stringify(ctx.request.body)}`);

            const query = `INSERT INTO syllabus_for_courses (${sessionCourseTableAttributes}) VALUES (${valueMarkers})  
                              ON DUPLICATE KEY UPDATE 
                               syllabus_url = '${valuesFromRequest.syllabus_url}'
                                `;
            dbConnection.query({
                sql: query,
                values: attributeValuesArray
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in SyllabusController::insertCurrentCourse", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });


        })
            .catch(error => console.log(`addSyllabusURL failed with error message, ${error}`));
    }


}

module.exports = SyllabusController;
