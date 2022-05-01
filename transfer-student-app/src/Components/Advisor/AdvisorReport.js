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
import Box from '@mui/material/Box';
import '../../components.css';
import API from "../../API_Interface/API_Interface";
import {AdvisorIDContext} from "../../UserIDProviders/AdvisorIDProvider";
import {advisorMatchedCourses, advisorRankedCourses} from "./AdvisorTableAttributes";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import {SaveButton} from "../ComponentUtils/SaveButton";
import {
    Link, useHistory, useLocation,
    useParams, useRouteMatch
} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {catalogTableAttributes} from "../Student/StudentTableAttributes";
import AdvisorTools from "./AdvisorTools";
import AdvisorReportSubmenu from "./AdvisorReportSubmenu";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {ArrowForward} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {AdvisorPreferenceProvider} from "./AdvisorPreferences";
import EligibleCourses from "../Student/EligibleCourses";

const requirementsJSON = require('../../Requirements/CS-BS_degree_requirements.json');
const prerequisitesJSON = require('../../Requirements/CS-BS_course_requisites_v2.json');

let keyID = 0;

const nextKey = () => keyID++;

export default function AdvisorReport(props) {
    const [matchedCourses, setMatchedCourses] = useState([]);
    const [student, setStudent] = useState({});
    const {studentID} = useParams();
    const [open, setOpen] = React.useState(false);
    const [course, setCourse] = useState({});

    const {path, url}  = useRouteMatch();
    const [reject, setReject] = useState(false);
    let location = useLocation();
    let history = useHistory();

    useEffect(() => {
        const api = new API();

        async function getStudent() {
            const studentJSONstring = await api.getStudentInfo(studentID);
            console.log(`studentJSONstring data from the DB ${JSON.stringify(studentJSONstring.data[0])}`);
            setStudent(studentJSONstring.data[0]);
        }

        getStudent();
    },[]);

    const onClickHandler = (course) => {
        setOpen(!open);
        setCourse(course);
    }

    console.log(studentID);

    return (student !== undefined && <Fragment>
        <Box className={'report-column'}>
            <Box sx={{ position: 'inherit', marginRight: 85, justifySelf: 'left', width: 150}}>

                <Button component={Link} to={`/advisor`}>
                    <ArrowBackIosNewIcon sx={{fontSize: 15}}/>
                    RETURN HOME
                </Button>

            </Box>
                {
                    <Typography variant="h5" component="div">
                    Report for {student.student_fName} {student.student_mName === null ? '' : student.student_mName + '.'} {student.student_lName}
                    </Typography>
                }
                <AdvisorTools/>
                <br/><br/><br/><br/>
            {
                open ?
                        <AdvisorReportSubmenu open={open} setOpen={setOpen} course={course} setCourse={setCourse} reject={reject} setReject={setReject}/>
                    :
                <MatchedCourses student={student} open={open} onClickHandler={onClickHandler}
                                matchedCourses={matchedCourses} setMatchedCourses={setMatchedCourses}/>
            }
            <div><br/><br/><br/><br/><br/><br/><br/><br/></div>
            <EligibleCourses lock={true} readOnly={true} student={student} style={'locked-view'} rejected={reject}/>
            <di><br/><br/><br/><br/><br/><br/><br/><br/></di>
        </Box>
    </Fragment>)

}

function MatchedCourses({student, open, onClickHandler, matchedCourses, setMatchedCourses}){

    useEffect(() => {
        const api = new API();

        async function getActiveCases() {
            const studentID = student.student_id;
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
            <Box>
            <TableContainer>
                <div className={'table-title-center'}>Student's Courses</div>

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
                            <TableCell key={makeKey()}>More Information</TableCell>
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
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => onClickHandler(course)}
                >
                    <ArrowForwardIosIcon sx={{fontSize: 15, color: 'blue'}}/>
                </IconButton>
            </TableCell>
        </TableRow>
    </Fragment>)
}
