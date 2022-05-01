import {Fragment, useContext, useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import API from "../../API_Interface/API_Interface";
import {AdvisorIDContext} from "../../UserIDProviders/AdvisorIDProvider";

export default function AdvisorTools(props){
    const {studentID} = useParams();
    const [locked, setLocked] = useState(false)
    const [studentCase, setStudentCase] = useState({})
    const [accessToken, setAccessToken] = useState(null);
    const advisorIDContext = useContext(AdvisorIDContext);

    useEffect(() => {
        const api = new API();
        async function getCaseInfo() {
            console.log(`getCurrentCourses is called`);
            const caseJSONString = await api.getStudentCase(studentID);
            console.log(`In CurrentCourses: currentCoursesJSONString from db is: ${JSON.stringify(caseJSONString.data)}`);
            setStudentCase(caseJSONString.data[0]);
            setLocked(Boolean(caseJSONString.data[0]['case_locked']));

        }
        getCaseInfo();
    }, []);

    const notifyStudent = () => {
        console.log(`in FinishButton::sendEmail`);

        const api = new API();

        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssustudent4@gmail.com',
            subject: `Your advisor has submitted their review of your case`,
            text: `You can review their assessment on your student page. This may have changed your eligibility for enrollment next semester.` +
                `\n\nIt's important that you read the Advisor Note whether a course matching was approved or rejected, as it may contain additional information.`+
                `\n\n Please login with your student token at http://localhost:3000/student`
        }

        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );


    }

    async function getAccesstoken() {
        console.log(`in getAccessToken`);
        const api = new API();
        const newStudentJSONString = await api.getStudentInfo(studentID);
        const newStudent = newStudentJSONString.data[0];
        let studentDictionary = {
            student_id: newStudent['student_id'],
            student_fName: newStudent['student_fName'],
            student_mName: newStudent['student_mName'],
            student_lName: newStudent['student_lName'],
        }

        await api.generateToken(studentDictionary).catch(error =>
            console.log(`Exception in emailHandler::generateToken ${error}`)
        );


        const accessTokenString = await api.getStudentToken(newStudent['student_id']);
        console.log(`accessToken is: ${JSON.stringify(accessTokenString)}`);
        console.log(`accessTokenData is ${JSON.stringify(accessTokenString.data)}`);


        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssustudent4@gmail.com',
            subject: 'Your student login token',
            text: `${newStudent.student_fName} ${newStudent.student_mName === null ? '' : newStudent.student_mName} ${newStudent.student_lName} login token for http://localhost:3000/student 
            \n ${accessTokenString.data[0].student_access_token}`
        }



        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );


    }



    const lockHandler = () => {
        const api = new API();
        let updatedCase = {
            ...studentCase,
            case_locked: +!locked
        }

        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssustudent4@gmail.com',
            subject: `Your advisor has unlocked your transfer report`,
            text: `Your advisor has unlocked your transfer report. Please login with your student token at http://localhost:3000/student`
        }

        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );
        api.insertNewCase(updatedCase).catch(error => console.log(`Exception in AdvisorTools:: lockHandler : ${error}`));;
        setLocked(!locked);
    }

    const approveHandler = () => {

        const api = new API();
        let updatedCase = {
            ...studentCase,
            case_approved: 1
        }
        api.insertNewCase(updatedCase).catch(error => console.log(`Exception in AdvisorTools:: lockHandler : ${error}`));;

    }


    return(
        <Fragment>
            <Box sx={{ justifyContent: 'center', display: 'flex', flexDirection: 'row', minWidth: 300, textAlign: 'center'}}>
                <Button onClick={async () => await getAccesstoken()}>Generate New Token</Button>
                <Button onClick={() => notifyStudent()}>Notify Student</Button>
                {
                    locked ? (
            <Button sx={{minWidth: 20}} onClick={() => lockHandler()}>Unlock Submission</Button>
                    ) : (
                        <Button onClick={() => lockHandler()}>Lock Submission</Button>
                    )

                }
                <Button onClick={() => approveHandler()}>Finalize Case</Button>

            </Box>
        </Fragment>
    )
}