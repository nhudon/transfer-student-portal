import React, {useState, useEffect, useContext, Fragment} from 'react';
import Box from '@mui/material/Box';
import VerticalLinearStepper from '../Stepper/VerticalStepper'
import {steps} from '../Stepper/StepperComponents';
import '../../components.css';

export default function StudentView({locked, setLocked}) {

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        console.log(`handleNext is called`)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);

    };

    /*
    * [courses, setCourses] is used to save Current Course progress locally.
    *  Otherwise, it's lost when changing steps
    */

    const [currentCourses, setCurrentCourses] = useState([]);
    const [additionalCourses, setAdditionalCourses] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);
    const [confirm, setConfirm] = useState(null);
    const [noneApply, setNoneApply] = useState(false);

    return activeStep < steps.length ? (
        <Fragment>
            <Box className='component-row'>
                <Box sx={{position: 'fixed', paddingRight: 200}} >
                <VerticalLinearStepper steps={steps}
                                       activeStep={activeStep} handleNext={handleNext} handleBack={handleBack}
                                       handleReset={handleReset} locked={locked} setLocked={setLocked}/>
                </Box>

                {steps[activeStep].component({courses: currentCourses, setCourses: setCurrentCourses,
                    additionalCourses, setAdditionalCourses, studentCourses, setStudentCourses,
                    confirm, setConfirm, noneApply, setNoneApply, handleNext})}
            </Box>
        </Fragment>) : (
        <Fragment>
            <Box className='component-row'>
                <VerticalLinearStepper steps={steps}
                                       activeStep={activeStep} handleNext={handleNext} handleBack={handleBack}
                                       handleReset={handleReset}/>
                <p> Done </p>
            </Box>
        </Fragment>
    )

}
