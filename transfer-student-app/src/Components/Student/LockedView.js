import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../../components.css';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import API from "../../API_Interface/API_Interface";
import {SaveButton} from "../ComponentUtils/SaveButton";
import HelpDialog from "../ComponentUtils/HelpDialog";
import {eligibleCoursesHelpText, lockScreenHelpText} from "../ComponentUtils/HelpTexts";
import makeKey from "../../utils/keyGenerator";
import {advisorMatchedCourses} from "../Advisor/AdvisorTableAttributes";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import {TextField} from "@mui/material";
import EligibleCourses from "./EligibleCourses";

const requirementsJSON = require('../../Requirements/CS-BS_degree_requirements.json');
const prerequisitesJSON = require('../../Requirements/CS-BS_course_requisites_v2.json');

//let keyID = 0;

//const makeKey = () => keyID++;

export default function LockedView(){
    const [matchedCourses, setMatchedCourses] = useState([]);

    const [student, setStudent] = useState({});
    const studentIDContext = useContext(StudentIDContext);
    const [open, setOpen] = React.useState(false);
    const [course, setCourse] = useState({})
    const {path, url}  = useRouteMatch();
    let location = useLocation();
    let history = useHistory();

    useEffect(() => {
        const api = new API();

        async function getStudent() {
            console.log(`in getStudent`);
            const studentID = studentIDContext.studentID;
            const studentJSONstring = await api.getStudentInfo(studentID);
            console.log(`studentInfo from the DB ${JSON.stringify(studentJSONstring.data[0])}`);
            setStudent(studentJSONstring.data[0]);
        }

        getStudent();
    },[]);



    const onClickHandler = (course) => {
        setOpen(!open);
        setCourse(course);
    }

    return(<Fragment>
        <Box className={'report-column'} >
            <Box sx={{alignSelf: 'left', flexDirection: 'row', marginRight: 57}}>

            <HelpDialog dialogtext={lockScreenHelpText}/>  <RequestNoteDialog student={student}/>
            </Box>
            <MatchedCourses student={student} open={open} onClickHandler={onClickHandler}
                            matchedCourses={matchedCourses} setMatchedCourses={setMatchedCourses}/>
            <EligibleCourses lock={true} readOnly={false} style={'lock-view'}/>
        </Box>
    </Fragment>)
}

function RequestNoteDialog({student}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [field, setField] = useState('');
    console.log(`Student info: ${JSON.stringify(student)}`);
    const requestHandler = () => {
        const api = new API();
        let emailDictionary = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssuadvisor4@gmail.com',
            subject: 'Submission unlock requested',
            text: `${student.student_fName} ${student.student_mName === null ? '' : student.student_mName} ${student.student_lName} (Student ID: ${student.student_id}) has requested to unlock their submission.` +
                `\n\n Reason: \n\n` + `${field} \n\n If you'd like to grant this student's request, you can do so at http://localhost:3000/advisor/student_report/${student.student_id}`
        }

        api.sendEmail(emailDictionary).catch(err => `Error in requestHandler: ${err}`);
        handleDialogClose();
    }


    const handleFieldChange = (event, attr) => {
        console.log(`In handleFieldChange ${event.target.value}`);
        let newField = event.target.value;
        console.log(`${JSON.stringify(newField)}`);
        setField(newField);
    }

    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };




    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    return(<Fragment>
        <Button onClick={handleDialogOpen('body')}>Request Unlock</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Request Reasoning</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p>Please include reasoning for your request.</p>

                    <TextField
                        id="outlined-multiline-static"
                        label="Multiline"
                        multiline
                        rows={10}
                        fullWidth={true}
                        onChange={(e) => handleFieldChange(e)}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={() => {requestHandler()}}>Submit</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function MatchedCourses({student, open, onClickHandler, matchedCourses, setMatchedCourses}){
    const studentIDContext = useContext(StudentIDContext);

    useEffect(() => {
        const api = new API();

        async function getActiveCases() {
            const studentID = studentIDContext.studentID;
            console.log(`In matchedCourses: ${studentID}`);
            const matchedCourseJSONstring = await api.getMatchedCourses(studentID);
            console.log(`matchedCourses from the DB ${JSON.stringify(matchedCourseJSONstring)}`);
            setMatchedCourses(matchedCourseJSONstring.data);
        }

        getActiveCases();
    },[student]);

    return(
        matchedCourses.length == 0 ? (<Box sx={{justifyContent: 'center'}}><Fragment>
                <p>No courses matched by student</p>
            </Fragment>
            </Box>)
            :
            (<Fragment>
                <Box >
                    <TableContainer>
                        <div className={'table-title-center'}>Your courses</div>

                        <Table>
                            <TableHead>
                                <TableRow key={makeKey()}>
                                    <TableCell key={makeKey()}>
                                        Status
                                    </TableCell>
                                    {
                                        advisorMatchedCourses.map(attr =>

                                            <TableCell key={makeKey()}>{attr.attributeName}</TableCell>
                                        )
                                    }
                                    <TableCell key={makeKey()}>Advisor Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <MatchedCourseTableBody matchedCourses={matchedCourses} open={open} onClickHandler={onClickHandler}/>
                        </Table>
                    </TableContainer>
                </Box>
            </Fragment>)
    )
}

function MatchedCourseTableBody({matchedCourses, open, onClickHandler}){

    return(
        <Fragment>
            <TableBody>
                {
                    matchedCourses.map(course =>
                        <MatchedCourseRows course={course} open={open} onClickHandler={onClickHandler}/>

                    )

                }
            </TableBody>
        </Fragment>
    )
}

function MatchedCourseRows({course, open, onClickHandler}){

    return(<Fragment>

        <TableRow key={makeKey()}>
            {
                course.rejected === null ?
                    <TableCell key={makeKey()}>
                        <QuestionMarkIcon/>
                    </TableCell> :
                    Boolean(course.rejected) ?
                        <TableCell key={makeKey()}>
                            <CloseIcon sx={{color: 'red'}}/>
                        </TableCell> :
                        <TableCell key={makeKey()}>
                            <CheckIcon sx={{color: 'green'}}/>
                        </TableCell>

            }
            {
                advisorMatchedCourses.map(attr =>
                    <TableCell key={makeKey()}>
                        {course[attr.attributeDBName]}
                    </TableCell>
                )
            }
            <TableCell key={makeKey()}>
                {
                course.advisor_note === null ? <Button sx={{borderStyle: 'solid', color: 'red'}}>Pending</Button> :
                <ViewNoteDialog course={course}/>
                }
            </TableCell>
        </TableRow>
        {/*<CollapsableCourseRows matchedCourse={course} open={open}/>*/}
    </Fragment>)
}

/* :*/



function ViewNoteDialog({course}){
    console.log(`in ViewNote`);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };



    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    return(<Fragment>
        <Button onClick={handleDialogOpen('body')}>View Note</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Advisor Note for {course.from_subject} {course.from_catalog} {course.from_title} </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    {
                        course.advisor_note
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}
