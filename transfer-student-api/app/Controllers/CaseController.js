const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class CaseController {
    constructor() {
        console.log('Constructor of CaseController is called.');
    }

    async activeCases(ctx) {
        console.log('active is called: advisorID is ', JSON.stringify(ctx.params.advisorID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_cases  
                        WHERE
                            advisor_id = ?  
                        ORDER BY
                        student_submission desc  
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.advisorID]
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

    async insertNewCase(ctx){
        console.log(`TransferController::insertCurrentCourse is called`)
        const sessionCourseTableAttributes = [
            'advisor_id',
            'student_id',
            'student_fName',
            'student_mName',
            'student_lName',
            'student_submission',
            'case_approved'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));

        const valuesToInsert = {
            ...valuesFromRequest,
        }

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);

        return new Promise((resolve, reject) => {
            console.log(`API server::insertNewCase: ${JSON.stringify(ctx.request.body)}`);
            console.log(`API server::insertNewCase after having added default values: ${JSON.stringify(valuesToInsert)}`);

            const query = ` INSERT INTO student_cases (${sessionCourseTableAttributes}) VALUES (${valueMarkers})
                             ON DUPLICATE KEY UPDATE
                             student_submission = ${valuesFromRequest.student_submission},
                             case_locked = ${valuesFromRequest.case_locked},
                             case_approved = ${valuesFromRequest.case_approved}`;
            dbConnection.query({
                sql: query,
                values: attributeValuesArray
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CaseController::insertCurrentCourse", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });


        })
            .catch(error => console.log(`insertNewCase failed with error message, ${error}`));
    }

    async getCaseByStudentID(ctx) {
        console.log('active is called: advisorID is ', JSON.stringify(ctx.params.advisorID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT *
                        FROM 
                            student_cases  
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



}

module.exports = CaseController;
