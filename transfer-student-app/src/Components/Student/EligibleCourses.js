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
import {eligibleCoursesHelpText} from "../ComponentUtils/HelpTexts";
import {Button, TextField} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const requirementsJSON = require('../../Requirements/CS-BS_degree_requirements.json');
const prerequisitesJSON = require('../../Requirements/CS-BS_course_requisites_v2.json');

let keyID = 0;

const nextKey = () => keyID++;

function Course (props) {
    //console.log(props.course);

    return <Fragment>
        <TableRow key={nextKey()}>
            <TableCell key={nextKey()}>
                {props.course.subject}
            </TableCell>
            <TableCell key={nextKey()}>
                {props.course.catalog}
            </TableCell>
            <TableCell key={nextKey()}>
                {props.course.title}
            </TableCell>
            { !props.readOnly ? [
            <TableCell key={nextKey()}>
                <IconButton
                    aria-label="priority up"
                    size="small"
                    onClick={()=>props.swap(props.index)}
                >
                    <ArrowUpwardIcon />
                </IconButton>
            </TableCell>,

                <TableCell key={nextKey()}>
                    <IconButton
                        aria-label="priority down"
                        size="small"
                        onClick={() => props.swap(props.index + 1)}
                    >
                        <ArrowDownwardIcon/>
                    </IconButton>
                </TableCell> ] : null
            }
                <TableCell key={nextKey()}>
                <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {props.setOpen(props.index);}}
                >
                {props.course.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
            {
                !props.readOnly && <CourseCatalogDialog course={props.course}/>
            }
        </TableRow>
        <TableRow key={nextKey()}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6} key={nextKey()   }>
                <Collapse in={props.course.open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="used courses">
                            <TableHead>
                                <TableRow key={nextKey()}>
                                    <TableCell key={nextKey()}>Title</TableCell>
                                    <TableCell key={nextKey()}>Subject</TableCell>
                                    <TableCell key={nextKey()}>Catalog</TableCell>
                                    <TableCell key={nextKey()}>Grade</TableCell>
                                    <TableCell key={nextKey()}>Units</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.course.used.map((usedCourse)=>(
                                        <TableRow key={nextKey()}>
                                            <TableCell key={nextKey()}>{usedCourse.title}</TableCell>
                                            <TableCell key={nextKey()}>{usedCourse.subject}</TableCell>
                                            <TableCell key={nextKey()}>{usedCourse.catalog}</TableCell>
                                            <TableCell key={nextKey()}>{usedCourse.grade}</TableCell>
                                            <TableCell key={nextKey()}>{usedCourse.units}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>
}

function Courses (props)
{
    //console.log('in Courses')
    //console.log(props);
    //const [courses,setCourses] = useState({courses:props.courses});
    if (props.courses.length == 0)
    {
        return null;
    }

    return <Fragment>
        <TableBody>
            {
                props.courses.map((course,index) =>
                    <Fragment>
                        <Course swap={(i) => props.swap(i)}
                                course={course}
                                index={index}
                                setOpen={(i) => props.setOpen(i)}
                                readOnly={props.readOnly}/>
                        <Fragment>
                            {
                                index == props.numCourses - 1 ?
                                <TableRow key={nextKey()}>
                                    <TableCell key={nextKey()}><br/><br/></TableCell>
                                    <TableCell key={nextKey()}></TableCell>
                                    <TableCell key={nextKey()}></TableCell>
                                    <TableCell key={nextKey()}></TableCell>
                                    <TableCell key={nextKey()}></TableCell>
                                    <TableCell key={nextKey()}></TableCell>
                                </TableRow> : null
                            }
                        </Fragment>
                    </Fragment>
                )
            }
        </TableBody>
    </Fragment>
}

function CourseCatalogDialog({course}){
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

    //console.log(course);

    return(<Fragment>
        <Button onClick={handleDialogOpen('body')}>See Description</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">{course['title']}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    {course['desc']}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function passingGrade(grade){
    if(grade === null || grade === 'AP') return true;
    let gradeString = grade.replace(/[^a-z\d\s]+/gi, "");
    const gradeValue = gradeString/100
    if(!isNaN(gradeValue) && gradeValue >= 1.7) return true;
    return gradeString === 'A' || gradeString === 'A-' || gradeString === 'B+' || gradeString === 'B' || gradeString === 'B-' || gradeString === 'C+' || gradeString == 'C' || gradeString === 'C-'
}

export default function EligibleCourses({student, lock, style, rejected, readOnly}) {

    const [completed, setCompleted] = useState([]);
    const [saved, setSaved] = useState([]);
    const [eligible, setEligible] = useState({courses: []});
    const [numCourses, setNumCourses] = useState('3');
    const [courseCatalog, setCourseCatalog] = useState([]);
    const studentIDContext = useContext(StudentIDContext);

    console.log(`In EligibleCourses student is ${JSON.stringify(student)}`);

    const handleFieldChange = (event) => {
        //console.log(`In handleFieldChange ${event.target.value}`);
        let newNumCourses = event.target.value;
        //console.log(`${JSON.stringify(newNumCourses)}`);
        setNumCourses(newNumCourses);
    }

    const swap = (index) => {
        if (index <= 0 || index >= eligible.courses.length) {return;}
        let newCourses = eligible.courses.slice();
        let temp = newCourses[index];
        newCourses[index] = newCourses[index-1];
        newCourses[index-1]=temp;
        setEligible(eligible => ({
            ...eligible,
            courses: newCourses
        }));
        return;
    }

    const setOpen = (i) => {
        let newCourses = eligible.courses.slice();
        newCourses[i] = {
            ...newCourses[i],
            open: !newCourses[i].open
        }
        setEligible(eligible => ({
            ...eligible,
            courses: newCourses
        }));
    }

    const handleSubmit = () => {

        const studentID = studentIDContext.studentID;
        console.log(`CurrentCourses::handleSubmit is called studentID is ${studentID}`)

        const api = new API();
        api.clearEligible(studentID);
        eligible.courses.forEach((course, index) => {
            //console.log(course);
            //console.log(numCourses);
            api.saveEligibleCourses(
                {
                    student_id: studentID,
                    subject: course.subject,
                    catalog: course.catalog,
                    priority: index,
                    num_courses: numCourses
                }
                ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        });
    }

    useEffect(() => {
        const api = new API();
        async function getCourses() {
            console.log(`In EligibleCourses::getCourses`);
            const studentID = student === undefined ? studentIDContext.studentID : student.student_id;
            console.log(`EligibleCourses::getCourses::studentID ${studentID}`);
            const completedJSON = await api.getEligible(studentID);
            const savedJSON = await api.getEligibleSaved(studentID);
            const catalogJSONString = await api.csCourseCatalogAll();
            // console.log(`catalog from the DB ${JSON.stringify(catalogJSONString.data)}`);
            setCourseCatalog(catalogJSONString.data);
            //console.log(`catalog state: ${JSON.stringify(courseCatalog)}`);
            console.log(`Completed courses from the DB: ${JSON.stringify(completedJSON)}`);
            setCompleted(completedJSON.data);
            setSaved(savedJSON.data);
            if (saved.length > 0) {
                setNumCourses(saved[0].num_courses);
            }
            //console.log(completed);
        }

        getCourses();
    }, [student, rejected]);

    useEffect(() => {
        if (completed.length > 0 && courseCatalog.length > 0) {
            //console.log(completed);
            let courses = [];
            requirementsJSON.requirements.map((requirement) => {
                let j = -1;
                if (requirement.requirement_type == 'course') {
                    j = requirement.courses_required;
                    if (j == 'all') {j = -1;}
                }
                requirement.groups.map((group) => {
                    let tentative = [];
                    let k = -1;
                    if ('maximum_courses' in group) {
                        k = group.maximum_courses;
                    }
                    group.single_courses.every((course) => {
                        let used = [];
                        let i = 0;
                        completed.map((taken) => {
                            if (course.subject == taken.subject && course.catalog == taken.catalog) {
                                //console.log(taken);
                                if (passingGrade(taken.grade)) {
                                    i++;
                                    if (k > 0) {
                                        j--;
                                        k--;
                                    }
                                }
                            }
                        });
                        //console.log(course);
                        //console.log(i);
                        // TODO: no duplicate checkoff
                        !i && `${course.subject} ${course.catalog}` in prerequisitesJSON.courses && prerequisitesJSON.courses[`${course.subject} ${course.catalog}`].course_pre_reqs.map((prereq) => {
                            let n = prereq.num_required;
                            prereq.courses.map((req) => {
                                //console.log(req);
                                for (const r in req) {
                                    //console.log(req[r].subject);
                                    completed.map((taken) => {
                                        //console.log(taken['subject']);
                                        if (req[r].subject == taken.subject && req[r].catalog == taken.catalog) {
                                            //console.log(req[r]);
                                            //console.log(taken);
                                            used.push(taken);
                                            if (passingGrade(taken.grade)) {
                                                n--;
                                            }
                                        }
                                    });
                                }
                            });
                            //console.log(`n: ${n}`);
                            if (n > 0) {
                                i++;
                            }
                        });
                        if (!i) {
                            let description = courseCatalog.find(desc => desc.subject == course.subject && desc.catalog == course.catalog);
                            //console.log(description);
                            description = (typeof description === 'undefined') ?  {
                                course_title_long: '',
                                catalog_description: ''
                            } : description;
                            tentative = [...tentative, {
                                used: used,
                                subject: course.subject,
                                catalog: course.catalog,
                                title: description.hasOwnProperty('course_title_long') ? description.course_title_long : '',
                                desc: description.hasOwnProperty('catalog_description') ? description.catalog_description : '',
                                open: false
                            }];
                        }
                        if(!k) {
                            tentative = [];
                        }
                        return k;
                    })
                    /*
                    'series_courses' in group && group.series_courses.map((course) => {

                    })*/
                    tentative.map((course,i) => {
                        if (courses.some((c, index) => c.subject == course.subject && c.catalog == course.catalog ? i = index : null)) {
                            courses[i] = course;
                        } else {
                            //console.log(course);
                            courses = [...courses, course];
                        }
                    })
                })
            });

            let newCourses = [];
            //console.log(saved);
            saved.map(save => {
                courses.some(course => {
                    if (save.subject == course.subject && save.catalog == course.catalog) {
                        newCourses.push(course);
                    }
                })
            })
            courses.map(course => {
                if (!newCourses.some(c => c.subject == course.subject && c.catalog == course.catalog)) {
                    newCourses.push(course);
                }
            })

            //console.log(newCourses);
            setEligible(eligible => ({
                ...eligible,
                courses: newCourses
            }));
        }
    },[completed, saved]);



    return <Fragment>
        {
            completed.length > 0 && eligible.courses.length > 0 && //!console.log(eligible) &&
            <Box className={style === undefined ? 'component-column' : style}>

                {
                    !lock ? [<HelpDialog dialogtext={eligibleCoursesHelpText}/>,
                            <TextField onChange={(e) => handleFieldChange(e)}
                               value={numCourses}
                               label="Set Preferred Number of CS Related Courses to be Enrolled in"/>,
                            <div><br/><br/><br/></div>]
                    :  <div><br/><br/><br/></div>

                }
                {
                    !readOnly && <Button onClick={() => handleSubmit()}>Save Rankings</Button>

                }


                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="requirement table">
                        <TableHead>
                            <TableRow key={nextKey()}>
                                <TableCell key={nextKey()}>
                                    Subject
                                </TableCell>
                                <TableCell key={nextKey()}>
                                    Catalog
                                </TableCell>
                                <TableCell key={nextKey()}>
                                    Title
                                </TableCell>
                                { !readOnly ? [
                                    <TableCell key={nextKey()}>
                                        Priority Up
                                    </TableCell>,
                                    <TableCell key={nextKey()}>
                                    Priority Down
                                    </TableCell>
                                    ] : null
                                }
                                <TableCell key={nextKey()}>
                                    Used Courses
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <Courses courses={eligible.courses} swap={(i) => swap(i)} setOpen={(i) => setOpen(i)} numCourses={numCourses} readOnly={readOnly}/>
                    </Table>
                </TableContainer>
                <div><br/><br/><br/></div>

            </Box>
        }
    </Fragment>
}