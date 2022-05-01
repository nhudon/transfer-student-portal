const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

class advisorStudentsController {
    constructor() {
        console.log('Constructor of advisorStudentsController is called.');
    }

    async newTransferStudents(ctx) {
        console.log('newTransferStudents is called: advisorID is ', JSON.stringify(ctx.params.advisorID));
        return new Promise((resolve, reject) => {
            const query = `
                        SELECT * FROM students;
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.advisorID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in advisorStudentsController::newTransferStudents", error);
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

    async getStudentInfo(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                        SELECT * FROM students
                        WHERE student_id = ?;
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in advisorStudentsController::newTransferStudents", error);
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


    async studentEmailInfo(ctx) {
        console.log('studentEmailInfo is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                        SELECT * FROM advisor_students
                        WHERE student_id = ? AND student_status = 'new'
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.studentID]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in advisorStudentsController::studentEmailInfo", error);
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

module.exports = advisorStudentsController;
