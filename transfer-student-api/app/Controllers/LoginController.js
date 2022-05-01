const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

class LoginController {
    async authorizeUser(ctx) {
        return new Promise((resolve, reject) => {

	    // Right up here, you could inspect the provided uers_id to
	    // make sure that it is, at the surface, a legitimate ID.
	    // For example, if user ids are suppose to be email addresses,
	    // you can at least make sure that user's input is consistent
	    // with the format of email addresses. 
	    
            let query = "SELECT * FROM student_login WHERE student_access_token = ?";
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.student_id]
                }, (error, tuples) => {
                    if (error) {
                        console.log("Query error.", error);
                        return reject(`Query error. Error msg: error`);
                    }
                    if (tuples.length === 1) {  // Did we have a matching user record?
                        // Split timestamp into [ Y, M, D, h, m, s ]
                        let expirationDateString = tuples[0].expiration_date.toISOString().split(/[- :]/);
                        let stringToDate = new Date(tuples[0].expiration_date.toISOString());
                        let todaysDate = new Date(Date.now());
                        if(todaysDate > stringToDate){

                            return reject('Student access token expired');
                        }

                        tuples[0]['role'] = 'student';
                        setAccessToken(ctx, tuples[0]);
                        console.log('from studentRecord. About to return ', tuples[0]);
                        ctx.body = {
                            status: "OK",
                            user: tuples[0],
                        };
                    } else {
                        console.log('Not able to identify the user.');
			return reject('No such user.');
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

    async generateTokenForStudent(ctx){

        const randomString = (str) => str.split('').reduce((accu, digit, idx) => accu + (Math.random() * digit * Math.pow(10, idx) ).toString(36), '').replace(/\./g, '').replace(/^\d+/, '');
        
        
        console.log(`LoginController::generateStudentToken is called`)
        const sessionCourseTableAttributes = [
            'student_id',
            'student_fName',
            'student_mName',
            'student_lName',
            'student_access_token',
            'expiration_date'

        ]

        let valuesFromRequest = JSON.parse(JSON.stringify(ctx.request.body));
        let access_token = randomString(valuesFromRequest.student_id.toString() + valuesFromRequest.student_id.toString()).substring(0, 127);
        // let expiration_date = Date.now() + (1000 * 60 * 60 * 24 * 3);

        let expiration_date = new Date (Date.now() + (1000 * 60 * 60 * 24 * 7)).toISOString().slice(0, 19).replace('T', ' ');
        console.log(expiration_date);
        console.log(`${access_token} of length ${access_token.length} generated`);
        const valuesToInsert = {
            ...valuesFromRequest,
            ...{
                student_access_token: access_token,
                expiration_date: expiration_date

            }
        }

        const valueMarkers = Array(sessionCourseTableAttributes.length).fill('?').join(', ');

        const attributeValuesArray = sessionCourseTableAttributes.reduce( (valuesAssembled, attribute) =>
        {
            valuesAssembled.push(valuesToInsert[attribute]);
            return valuesAssembled;
        }, []);

        return new Promise((resolve, reject) => {
            console.log(`API server::generateToken: ${JSON.stringify(ctx.request.body)}`);
            console.log(`API server::generateToken after having added default values: ${JSON.stringify(valuesToInsert)}`);

            const query = ` INSERT INTO student_login (${sessionCourseTableAttributes}) VALUES (${valueMarkers}) 
                            ON DUPLICATE KEY UPDATE
                            student_access_token = '${access_token}',
                            expiration_date = '${expiration_date}'`;
            dbConnection.query({
                sql: query,
                values: attributeValuesArray
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in LoginController::generateStudentToken", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });


        })
            .catch(error => console.log(`generateToken failed with error message, ${error}`));
    }

    async getStudentToken(ctx) {
        console.log('getStudentToken is called: studentID is ', JSON.stringify(ctx.params.studentID));
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT student_access_token
                        FROM 
                            student_login  
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

module.exports = LoginController;
