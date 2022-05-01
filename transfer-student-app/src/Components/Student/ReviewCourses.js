import Box from '@mui/material/Box';
import '../../components.css';
import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import makeKey from '../../utils/keyGenerator';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import '../../components.css';
import API from "../../API_Interface/API_Interface";
import {AdvisorIDContext} from "../../UserIDProviders/AdvisorIDProvider";
import {advisorMatchedCourses, advisorRankedCourses} from "../Advisor/AdvisorTableAttributes";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import {SaveButton} from "../ComponentUtils/SaveButton";
import {
    useParams
} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {catalogTableAttributes} from "../Student/StudentTableAttributes";
import {StudentIDProvider} from "../../UserIDProviders/StudentIDProvider";
import EligibleCourses from "./EligibleCourses";
import HelpDialog from "../ComponentUtils/HelpDialog";
import {reviewCoursesHelpText} from "../ComponentUtils/HelpTexts";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";

const requirementsJSON = require('../../Requirements/CS-BS_degree_requirements.json');
const prerequisitesJSON = require('../../Requirements/CS-BS_course_requisites_v2.json');


let keyID = 0;

const nextKey = () => keyID++;

export default function ReviewCourses(props) {

    return (<Fragment>

        <Box className={'component-column'}>
            <HelpDialog dialogtext={reviewCoursesHelpText}/>
            <MatchedCourses/>
            <div><br/><br/><br/><br/><br/><br/><br/><br/></div>
            <EligibleCourses readOnly={true} lock={true} style={'lock-view'}/>
            <di><br/><br/><br/><br/><br/><br/><br/><br/></di>
        </Box>
    </Fragment>)

}

function MatchedCourses({student}){
    const [matchedCourses, setMatchedCourses] = useState([]);
    const studentIDContext = useContext(StudentIDContext);

    useEffect(() => {
        const api = new API();

        async function getMatchedCourses() {
            const studentID = studentIDContext.studentID;
            console.log(`In matchedCourses: ${studentID}`);
            const matchedCourseJSONstring = await api.getMatchedCourses(studentID);
            console.log(`matchedCourses from the DB ${JSON.stringify(matchedCourseJSONstring)}`);
            setMatchedCourses(matchedCourseJSONstring.data);
        }

        getMatchedCourses();
    },[student]);

    return(
        matchedCourses.length == 0 ? (<Box sx={{justifyContent: 'center'}}><Fragment>
                <p>No courses matched by student</p>
            </Fragment>
            </Box>)
            :
            (<Fragment>
                <Box>
                    <TableContainer>
                        <div className={'table-title-center'}>Matched Courses</div>

                        <Table>
                            <TableHead>
                                <TableRow key={makeKey()}>
                                    {
                                        advisorMatchedCourses.map(attr =>

                                            <TableCell key={makeKey()}>{attr.attributeName}</TableCell>
                                        )
                                    }
                                    <TableCell key={makeKey()}>Syllabus</TableCell>
                                    <TableCell key={makeKey()}>Note</TableCell>
                                    <TableCell key={makeKey()}>Matching</TableCell>
                                </TableRow>
                            </TableHead>
                            <MatchedCourseTableBody matchedCourses={matchedCourses}/>
                        </Table>
                    </TableContainer>
                </Box>
            </Fragment>)
    )
}

function MatchedCourseTableBody({matchedCourses}){

    return(
        <Fragment>
            <TableBody>
                {
                    matchedCourses.map(course =>
                        <MatchedCourseRows course={course}/>

                    )

                }
            </TableBody>
        </Fragment>
    )
}

function MatchedCourseRows({course}){
    const [open, setOpen] = React.useState(false);

    return(<Fragment>
        <TableRow key={makeKey()}>
            {
                advisorMatchedCourses.map(attr =>
                    <TableCell key={makeKey()}>
                        {course[attr.attributeDBName]}
                    </TableCell>
                )
            }
            <TableCell key={makeKey()}>
                <SyllabusDialog course={course}/>
            </TableCell>
            <TableCell key ={makeKey()}>
                <ViewNoteDialog course={course}/>
            </TableCell>
            <TableCell key={makeKey()}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
            </TableCell>
        </TableRow>
        <CollapsableCourseRows matchedCourse={course} open={open}/>
    </Fragment>)
}

function CollapsableCourseRows({open, matchedCourse}){
    return(
        <Fragment>
            <TableRow key={makeKey()}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div><p className={'table-title-center'}>SSU Course</p> </div>
                            <Table size="small" aria-label="purchases">
                                <TableHead>

                                    <TableRow key={makeKey()}>

                                        {
                                            advisorMatchedCourses.map(attr =>
                                                <TableCell key={makeKey()}>
                                                    {attr.attributeName}
                                                </TableCell>)
                                        }

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={makeKey()}>
                                        <TableCell key={makeKey()}>
                                            Sonoma State University
                                        </TableCell>
                                        <TableCell key ={makeKey()}>
                                            {matchedCourse['ssu_subject']}
                                        </TableCell>
                                        <TableCell key ={makeKey()}>
                                            {matchedCourse['ssu_catalog']}
                                        </TableCell>
                                        <TableCell key ={makeKey()}>
                                            {matchedCourse['ssu_title']}
                                        </TableCell>
                                        <TableCell key ={makeKey()}>
                                            {matchedCourse['ssu_units']}
                                        </TableCell>


                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

function ViewNoteDialog({course}){
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
            <DialogTitle id="scroll-dialog-title">Note for {course.from_subject} {course.from_catalog} {course.from_title} </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    {
                        course.student_note
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function AddNoteDialog({course, courses, setStudentCourses, courseIdx}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [field, setField] = useState('');

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


    const onSubmitHandler = () => {
        const api = new API();
        let coursesSlice = courses.slice();
        coursesSlice[courseIdx] = {...course, advisor_note: field};
        const courseDictionary = {
            ...course,
            advisor_note: field
        };

        console.log(`courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        setStudentCourses(coursesSlice);
        handleDialogClose();
    }

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
        <Button onClick={handleDialogOpen('body')}>Add Note</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Note to Student</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p> You may wish to provide additional details to this student regarding your evaluation of their
                        provided course details.</p>

                    <TextField
                        id="outlined-multiline-static"
                        label="Multiline"
                        multiline
                        rows={10}
                        fullWidth={true}
                        onChange={(e) => handleFieldChange(e)}
                        defaultValue={course.advisor_note}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={() => {onSubmitHandler()}}>Submit</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function SyllabusDialog({course}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [file, setFile] = useState(null)
    const [url, setURL] = useState(null);

    useEffect(() => {
        const api = new API();

        async function getSyllabusURL() {
            const syllabusURLJSONstring = await api.getSyllabusURL(course.course_key);
            console.log(`url from the DB ${JSON.stringify(syllabusURLJSONstring)}`);
            if(syllabusURLJSONstring.data.length === 0 ||
                syllabusURLJSONstring.data[0].syllabus_url === null) return;

            setURL(syllabusURLJSONstring.data[0].syllabus_url);
            console.log(`Syllabus URL: ${syllabusURLJSONstring.data[0].syllabus_url} is of type ${typeof syllabusURLJSONstring.data[0].syllabus_url}`)

        }

        getSyllabusURL();
    },[]);

    useEffect(() => {
        const api = new API();

        async function getSyllabusPDF() {
            console.log(`in getSyllabusPDF`);
            const pdfFromServer = await api.getSyllabusPDF( course.course_key ).catch(error => console.log(`Exception in CurrentCourses::handleSave : ${error}`));
            if(pdfFromServer === undefined || pdfFromServer.data.status === "Failed") return;
            // console.log(`Our file: ${JSON.stringify(pdfFromServer.data)}`);
            setFile(pdfFromServer.data);
        }

        getSyllabusPDF();
    },[]);

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
        <Button onClick={handleDialogOpen('body')} >View Syllabus</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">About this page</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    style={{whiteSpace: 'pre-line'}}
                >

                    <Box sx={{flexDirection:'row'}}>
                        {
                            file !== null ? <a href={`http://localhost:8443/api/v1/download/${course.course_key}/get-syllabus`} style={{textDecoration: 'none'}} download="studentProvidedDoc.pdf">
                                    <Button>Download <DownloadIcon/></Button>
                                </a>
                                : null
                        }
                        {
                            url !== null ?
                                <Button onClick={() => { window.open(`${url}`) ; return null;}}>View <LinkIcon/></Button>

                                : null
                        }
                        {
                            url === null && file === null && <Typography>No syllabus provided</Typography>
                        }
                    </Box>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}


