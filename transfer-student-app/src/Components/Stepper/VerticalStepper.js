import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CompletedCourses from '../Student/CompletedCourses';
import CurrentCourses from '../Student/CurrentCourses';
import AdditionalCourses from '../Student/AdditionalCourses';
import EligibleCourses from '../Student/EligibleCourses';
import CorrespondingCourses from '../Student/CorrespondingCourses';
import {Add} from "@mui/icons-material";
import {Fragment, useContext, useEffect, useState} from "react";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import API from "../../API_Interface/API_Interface";
import {ConfirmationDialog} from "../ComponentUtils/SaveButton";

export default function VerticalLinearStepper({steps, activeStep, handleNext, handleBack, handleReset, locked, setLocked }) {
    const [studentCase, setStudentCase] = useState([])
    const studentIDContext = useContext(StudentIDContext);


    useEffect(() => {
        const api = new API();

        async function getStudentCase() {
            const studentID = studentIDContext.studentID;
            const studentCaseJSONstring = await api.getStudentCase(studentID);
            console.log(`student from the DB ${JSON.stringify(studentCaseJSONstring.data)}`);
            setStudentCase(studentCaseJSONstring.data[0])
        }

        getStudentCase();
    },[])

    return (
        <Box sx={{ maxWidth: 400, marginTop: 5 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    {index === steps.length - 1 ?
                                        <FinishButton locked={locked} setLocked={setLocked} studentCase={studentCase}/>
                                        :
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{mt: 1, mr: 1}}
                                        >
                                            Continue
                                        </Button>
                                    }
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>

                        </StepContent>
                        <Box>
                        </Box>
                    </Step>

                ))}

            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

function FinishButton({studentCase, locked, setLocked}){
    const [submit, setSubmit] = useState(false);
    const studentIDContext = useContext(StudentIDContext);

    const onClickHandler = () => {
        console.log(`In AdditionalCourses::onClickHandler; submit is ${submit}`);
        setSubmit(!submit);
    }

    async function sendEmail() {
        console.log(`in FinishButton::sendEmail`);
        const studentID = studentIDContext.studentID;

        const api = new API();
        const studentInfoJSONString = await api.getStudentInfo(studentID);
        const studentInfoData = studentInfoJSONString.data[0];
        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssuadvisor4@gmail.com',
            subject: `${studentInfoData.student_fName} ${studentInfoData.student_lName} (Student ID: ${studentInfoData.student_id}) has submitted their report`,
            text: `${studentInfoData.student_fName} ${studentInfoData.student_mName === null ? '' : studentInfoData.student_mName} ${studentInfoData.student_lName} (Student ID: ${studentInfoData.student_id}) has submitted` +
                ` their transfer student report. \n \n It can be found at http://localhost:3000/advisor/student_report/${studentInfoData.student_id}`
        }




        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );


    }

    const onSubmit = () => {
        let caseDictionary = {
            ...studentCase,
            student_submission: 1,
            case_locked: 1
        }

        let api = new API();
        api.insertNewCase(caseDictionary).catch(error => console.log(`Exception in VerticalStepper.js::FinishButton::onSubmit : ${error}`));
        sendEmail();
        setLocked(!locked);
    }

    return (
        <Fragment>
        <Button
            variant="contained"
            onClick={onClickHandler}
            sx={{mt: 1, mr: 1}}
        >Finish
        </Button>
    {submit && <ConfirmationDialog postFunction={onSubmit}/>}
        </Fragment>
    )
}

export {VerticalLinearStepper};