const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const setAccessToken = require("../../config/setAccessToken");

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class TransferController {
    constructor() {
        console.log('Constructor of TransferController is called.');
    }

    async transferCourses(ctx) {
        console.log('transferCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transfer_courses  
                        WHERE
                            student_id = ? 
                        ORDER BY 
                            from_year,
                            from_semester
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async enrollment(ctx) {
        console.log('transferCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            enrollment e, course_catalog c 
                        WHERE
                            e.catalog = c.catalog
                            AND
                            e.student_id = ? 
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async testCreditCourses(ctx) {
        console.log('transferCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            test_credit_courses  
                        WHERE
                            student_id = ? 
                     
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async majorCourses(ctx) {
        console.log('majorCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        console.log(`subject is: ${JSON.stringify(ctx.params.subject)}`);
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transfer_courses
                        WHERE
                            student_id = ? 
                            AND ssu_subject = ?
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID, ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async arrUpdateForm(ctx) {
        console.log('arrUpdateForm is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            arr_update_form  
                        WHERE
                            student_id = ? 
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async student(ctx) {
        console.log('arrUpdateForm is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            students  
                        WHERE
                            student_id = ? 
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async transferCoursesNonArticulated(ctx) {
        console.log('transferCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            transfer_courses  
                        WHERE
                            student_id = ? AND ssu_subject IS NULL             
                     
                        GROUP BY
                            from_title,
                            from_semester,
                            from_year,
                            from_catalog,
                            from_grade,
                            from_units
                        ORDER BY 
                            from_year,
                            from_semester
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async insertCurrentCourse(ctx){
        console.log(`TransferController::insertCurrentCourse is called`)
        const sessionCourseTableAttributes = [
            'student_id',
            'ssu_subject',
            'ssu_ge_designation',
            'ssu_catalog',
            'from_year',
            'from_units',
            'from_title',
            'from_subject',
            'from_sequence_nbr',
            'from_semester',
            'from_school',
            'from_group',
            'from_grade',
            'from_current_courses',
            'from_catalog',
            'from_additional_courses',
            'student_priority',
            'transfer_term'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
            ...{
                from_current_courses: 1,
            }
        }

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);

        return new Promise((resolve, reject) => {
            console.log(`API server::insertCurrentCourses: ${JSON.stringify(ctx.request.body)}`);
            console.log(`API server::insertCurrentCourses after having added default values: ${JSON.stringify(valuesToInsert)}`);

            const query = ` INSERT INTO student_session_courses (${sessionCourseTableAttributes}) VALUES (${valueMarkers})`;
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
            .catch(error => console.log(`insertNewRoute failed with error message, ${error}`));
    }

    async insertAdditionalCourse(ctx){
        console.log(`TransferController::insertAdditionalCourse is called`)
        const sessionCourseTableAttributes = [
            'student_id',
            'ssu_subject',
            'ssu_ge_designation',
            'ssu_catalog',
            'from_year',
            'from_units',
            'from_title',
            'from_subject',
            'from_sequence_nbr',
            'from_semester',
            'from_school',
            'from_group',
            'from_grade',
            'from_current_courses',
            'from_catalog',
            'from_additional_courses',
            'student_priority',
            'transfer_term'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
            ...{
                from_additional_courses: 1,
            }
        }

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);

        return new Promise((resolve, reject) => {
            console.log(`API server::insertCurrentCourses: ${JSON.stringify(ctx.request.body)}`);
            console.log(`API server::insertCurrentCourses after having added default values: ${JSON.stringify(valuesToInsert)}`);

            const query = ` INSERT INTO student_session_courses (${sessionCourseTableAttributes}) VALUES (${valueMarkers})`;
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
            .catch(error => console.log(`insertNewRoute failed with error message, ${error}`));
    }

    async updateStudentCourses(ctx){
        console.log(`TransferController::updateStudentCourses is called`)

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));
        console.log(`${valuesFromRequest.ssu_subject}`);
        console.log(`${valuesFromRequest.ssu_catalog}`);
        console.log(`${valuesFromRequest.student_id}`);
        console.log(`${valuesFromRequest.from_title}`);
        console.log(`${valuesFromRequest.from_subject}`);
        console.log(`${valuesFromRequest.from_catalog}`);
        return new Promise((resolve, reject) => {
            console.log(`API server::insertCurrentCourses: ${JSON.stringify(ctx.request.body)}`);
            //console.log(`API server::insertCurrentCourses after having added default values: ${JSON.stringify(valuesToInsert)}`);

            const query = `UPDATE student_session_courses 
                                SET 
                                ssu_subject = '${valuesFromRequest.ssu_subject}', 
                                ssu_catalog = '${valuesFromRequest.ssu_catalog}'
                                WHERE 
                                student_id = '${valuesFromRequest.student_id}' 
                                AND from_title = '${valuesFromRequest.from_title}'
                                AND from_subject = '${valuesFromRequest.from_subject}'
                                AND from_catalog = '${valuesFromRequest.from_catalog}'`;
            dbConnection.query({
                sql: query,
                // values: attributeValuesArray
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
            .catch(error => console.log(`updateStudentCourses failed with error message, ${error}`));
    }

    async getCurrentCourses(ctx) {
        console.log('getCurrentCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_session_courses  
                        WHERE
                            student_id = ? 
                        AND
                            from_current_courses = 1
                        AND
                            status = 1
                      
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
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

    async getAdditionalCourses(ctx) {
        console.log('getAdditionalCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_session_courses  
                        WHERE
                            student_id = ? 
                        AND
                            from_additional_courses = 1
                    
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::getAdditionalCourses", error);
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

    async getSessionCourses(ctx) {
        console.log('getSessionCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_session_courses  
                        WHERE
                            student_id = ? 
                        AND
                            status = 1
                      
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::getSessionCourses", error);
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

    async eligible(ctx) {
        console.log('eligible is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT e.student_id, e.subject, e.catalog, e.units, e.grade, c.course_title_long AS title 
                       FROM enrollment AS e, course_catalog as c  
                       WHERE e.subject = c.subject 
                       AND e.catalog = c.catalog 
                       AND e.student_id = ? 
                       UNION
                       SELECT tc.student_id, tc.ssu_subject, tc.ssu_catalog, tc.units, tc.test_name, tc.course_title 
                       FROM test_credit_courses AS tc 
                       WHERE tc.student_id = ? 
                       UNION
                       SELECT a.student_id, a.ssu_subject, a.ssu_catalog, a.units, a.grade, a.short_descr 
                       FROM arr_update_form AS a 
                       WHERE a.student_id = ? 
                       UNION
                       SELECT ssc.student_id, ssc.ssu_subject, ssc.ssu_catalog, ssc.from_units, ssc.from_grade, ssc.from_title 
                       FROM student_session_courses AS ssc 
                       WHERE ssc.student_id = ?
                       AND ssc.status = 1 AND (ssc.rejected = 0 OR ssc.rejected is null)
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID,ctx.params.studentID,ctx.params.studentID,ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async eligibleSaved(ctx) {
        console.log('eligible is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT * 
                       FROM eligible_courses 
                       WHERE student_id = ? 
                       ORDER BY priority
                       ; 
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::transactionsForCycleID", error);
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

    async studentSessionCourses(ctx){
        console.log(`TransferController::studentSessionCourses is called`)
        console.log(`${JSON.stringify(ctx.request.body)}`);
        const sessionCourseTableAttributes = [
            'course_key',
            'student_id',
            'ssu_subject',
            'ssu_ge_designation',
            'ssu_catalog',
            'ssu_title',
            'ssu_units',
            'from_year',
            'from_units',
            'from_title',
            'from_subject',
            'from_sequence_nbr',
            'from_semester',
            'from_school',
            'from_group',
            'from_grade',
            'from_current_courses',
            'from_catalog',
            'from_additional_courses',
            'student_priority',
            'transfer_term',
            'status',
            'student_note',
            'advisor_note',
            'rejected'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
        }

        const ssu_subject = valuesFromRequest.ssu_subject === null ? null : `'${valuesFromRequest.ssu_subject}'`;
        const ssu_catalog = valuesFromRequest.ssu_catalog === null ? null : `'${valuesFromRequest.ssu_catalog}'`;
        const ssu_title = valuesFromRequest.ssu_title === null ? null : `'${valuesFromRequest.ssu_title}'`;
        const student_note = valuesFromRequest.student_note === null ? null : `'${valuesFromRequest.student_note}'`;
        const advisor_note = valuesFromRequest.advisor_note === null ? null : `'${valuesFromRequest.advisor_note}'`;
        const ssu_units = valuesFromRequest.ssu_units === undefined ? null : valuesFromRequest.ssu_units;
        console.log(`API server::studentSessionCourses after having added default values: ${JSON.stringify(valuesToInsert)}`);

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);
        console.log(`attributeValuesArray is : ${attributeValuesArray}`);

        return new Promise((resolve, reject) => {
            console.log(`API server::studentSessionCourses: ${JSON.stringify(ctx.request.body)}`);

            const query = `INSERT INTO student_session_courses (${sessionCourseTableAttributes}) VALUES (${valueMarkers})  
                              ON DUPLICATE KEY UPDATE 
                                from_subject = '${valuesFromRequest.from_subject}',
                                from_title = '${valuesFromRequest.from_title}',
                                from_catalog = '${valuesFromRequest.from_catalog}',
                                from_school = '${valuesFromRequest.from_school}' ,                            
                                ssu_subject = ${ssu_subject},
                                ssu_catalog = ${ssu_catalog},
                                ssu_title = ${ssu_title},
                                ssu_units = ${ssu_units},
                                from_current_courses = ${valuesFromRequest.from_current_courses},
                                from_additional_courses = ${valuesFromRequest.from_additional_courses},
                                student_note = ${student_note},
                                advisor_note = ${advisor_note},
                                status = ${valuesFromRequest.status},
                                rejected = ${valuesFromRequest.rejected}
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

    async saveEligibleCourses(ctx){
        console.log(ctx.request.body)
        const eligibleTableAttributes = [
            'student_id',
            'subject',
            'catalog',
            'priority',
            'num_courses'
        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
        }
        console.log(`API server::saveEligibleCourses after having added default values: ${JSON.stringify(valuesToInsert)}`);

        const valueMarkers = Array(eligibleTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = eligibleTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);
        console.log(`attributeValuesArray is : ${attributeValuesArray}`);

        return new Promise((resolve, reject) => {
            console.log(`API server::saveEligibleCourses: ${JSON.stringify(ctx.request.body)}`);

            const query = `INSERT INTO eligible_courses (${eligibleTableAttributes}) VALUES (${valueMarkers})  
                              ON DUPLICATE KEY UPDATE 
                                priority = ${valuesFromRequest.priority}
                                `;
            dbConnection.query({
                sql: query,
                values: attributeValuesArray
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransferController::saveEligibleCourse", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });


        })
            .catch(error => console.log(`saveEligibleCourses failed with error message, ${error}`));
    }

    async clearEligible(ctx) {
        console.log('clearEligible is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       DELETE FROM eligible_courses
                       WHERE student_id = ?;
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransferController::clearEligible", error);
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

    async getMatchedCourses(ctx) {
        console.log('getSessionCourses is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_session_courses  
                        WHERE
                            student_id = ? 
                        AND
                            ssu_subject IS NOT NULL
                        AND
                            ssu_catalog IS NOT NULL
                        AND
                            status = 1
                      
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in TransactionsController::getSessionCourses", error);
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

module.exports = TransferController;
