import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"
import '../../components.css';
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import API from "../../API_Interface/API_Interface";
import {
    correspondingStudentCoursesTableAttributes,
    catalogTableAttributes
} from './StudentTableAttributes'
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import makeKey from "../../utils/keyGenerator";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {TextField} from "@mui/material";
import HelpDialog from "../ComponentUtils/HelpDialog";
import {correspondingCoursesHelpText} from "../ComponentUtils/HelpTexts";

export default function CorrespondingCourses({studentCourses, setStudentCourses}) {
    const [courseCatalog, setCourseCatalog] = useState([]);
    const [majorCourses, setMajorCourses] = useState([]);
    const [control, setControl] = useState(false);
    const studentIDContext = useContext(StudentIDContext);

    useEffect(() => {
        const api = new API();

        async function getSessionCourses() {
            const studentID = studentIDContext.studentID;
            const sessionCoursesJSONString = await api.getSessionCourses(studentID);
            console.log(`Student's sessionCourses: ${JSON.stringify(sessionCoursesJSONString.data)}`)
            setStudentCourses(sessionCoursesJSONString.data);
        }

        getSessionCourses();
    }, []);

    useEffect(() => {
        const api = new API();
        async function getCourseCatalog() {
            const subject = 'CS';
            const catalogJSONString = await api.csCourseCatalog();
            //console.log(`catalog from the DB ${JSON.stringify(catalogJSONString.data)}`);
            setCourseCatalog(catalogJSONString.data);
            //console.log(`catalog state: ${JSON.stringify(courseCatalog)}`);
        }

        getCourseCatalog();
    }, []);

    useEffect(() => {
        const api = new API();
        async function getMajorCourses() {
            const studentID = studentIDContext.studentID;
            const subject = 'CS';
            const catalogJSONString = await api.majorCourses(studentID, subject);
            //console.log(`articulated major courses from the DB ${JSON.stringify(catalogJSONString.data)}`);
            setMajorCourses(catalogJSONString.data);
            //console.log(`majorCourses state: ${JSON.stringify(majorCourses)}`);
        }

        getMajorCourses();
    }, []);


    const handleSubmit = () => {
        console.log(`CorrespondingCourses::handleSubmit is called`)
        const studentID = studentIDContext.studentID;
        const api = new API();
        studentCourses.forEach((course) => {
            console.log(`${JSON.stringify(course)}`);
            api.updateStudentCourses(
                {
                    student_id: studentID,
                    from_subject: course.from_subject.trim(),
                    from_catalog: course.from_catalog.trim(),
                    from_title: course.from_title.trim(),
                    from_units: course.from_units,
                    ssu_title: course.ssu_title,
                    ssu_subject: course.ssu_subject,
                    ssu_catalog: course.ssu_catalog
                }
            ).catch(error => console.log(`Exception in CorrespondingCourses::handleSubmit : ${error}`));
        });
    }

    return (
        <Fragment>

            {   studentCourses.length === 0 ?
                (
                    <Box className='component-column'>
                        <div>
                            <p> It looks like you haven't selected any courses in the previous steps.</p>
                            <p> If you'd like to add courses, press the back button on the sidebar to do so.
                            </p>
                            <p> Otherwise, click
                                continue to rank the courses you'd like to take in your upcoming semester.</p>
                    </div>
                    </Box>) : (
                    <Box className='component-column'>
                        <HelpDialog dialogtext={correspondingCoursesHelpText}/>
                    <TableContainer component={Paper}>
                        <div><p className='table-title-center'>Match Your Courses</p></div>
                        <Table sx={{minWidth: 650}} aria-label="current course table">
                            <CorrespondingCoursesTableHead/>
                            <CorrespondingCoursesTableBody
                                courses={studentCourses}
                                setStudentCourses={setStudentCourses}
                                catalog={courseCatalog}
                                control={control}
                                setControl={setControl}
                            />
                        </Table>
                    </TableContainer>
                    <div><br/><br/><br/></div>
                    <div><br/><br/><br/></div>
                    </Box>
                )

            }

        </Fragment>
    )
}

function CorrespondingCoursesTableHead(){
    console.log('in CorrespondingCoursesTableHead');

    return (
        <Fragment>
            <TableHead>
                <TableRow key={makeKey}>
                    <TableCell key={makeKey()}>Expand</TableCell>
                    {
                        correspondingStudentCoursesTableAttributes.map( attr =>
                            <TableCell key={makeKey()}>
                                {attr.attributeName}
                            </TableCell>
                        )
                    }
                    <TableCell key={makeKey()}>
                        Syllabus
                    </TableCell>
                    <TableCell key={makeKey()}>
                        Note
                    </TableCell>
                </TableRow>
            </TableHead>
        </Fragment>
    );
}

function CorrespondingCoursesTableBody({setStudentCourses, courses, catalog, control, setControl}) {
    console.log('in CorrespondingCoursesTableBody');
    console.log(`courses ${JSON.stringify(courses)}`);
    return (
        <Fragment>
            <TableBody>
                {
                    courses.map((course, courseIdx) =>
                        <StudentCourseRows
                            setStudentCourses={setStudentCourses}
                            courses={courses}
                            course={course}
                            catalog={catalog}
                            courseIdx={courseIdx}
                            control={control}
                            setControl={setControl}
                        />

                    )
                }
            </TableBody>

        </Fragment>
    );
}

function StudentCourseRows ({setStudentCourses, courses, courseIdx, course, catalog, control, setControl}){
    const [open, setOpen] = React.useState(false);
    console.log('in StudentCoursesRows');
    console.log(`${JSON.stringify(course)}`);

    return (
            <Fragment>

                <TableRow key={ course.from_catalog + course.from_title + '_studentRow'}
                          sx={course.ssu_subject === null && course.ssu_catalog === null ?
                              {bgcolor: 'white'} : {bgcolor: "#92FA3B"}}>
                    <TableCell key={makeKey()}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>
                    {
                        correspondingStudentCoursesTableAttributes.map(attr =>
                            <TableCell key={makeKey()}>
                                {course[attr.attributeDBName]}
                            </TableCell>
                        )
                    }
                    <TableCell key={makeKey()}>
                    <UploadFormDialog course={course}/>
                    </TableCell>
                    <TableCell key={makeKey()}>

                    <AddNoteDialog course={course}
                                   courses={courses}
                                   courseIdx={courseIdx}
                                   setStudentCourses={setStudentCourses}/>
                    </TableCell>
                </TableRow>
                <CollapsableCatalogRows courses={courses}
                                        course={course} catalog={catalog}
                                        setOpen={setOpen} open={open} setStudentCourses={setStudentCourses}
                                        courseIdx={courseIdx}/>
        </Fragment>
    )

}

function CollapsableCatalogRows({courses, setStudentCourses, open, setOpen, catalog, course, courseIdx}){
    return(<Fragment>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            SSU Courses
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    {
                                        catalogTableAttributes.map(attr =>
                                            <TableCell key={makeKey()}>
                                                {attr.attributeName}
                                            </TableCell>)
                                    }
                                    <TableCell key={makeKey()}>
                                        Description
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {catalog.map((entry, catIdx) => (

                                    <TableRow key={makeKey()} sx={course.ssu_catalog === entry.catalog
                                    && course.ssu_subject === entry.subject
                                    && course.ssu_title === entry.course_title_long ? {bgcolor: "#92FA3B"} : {bgcolor: 'white'}}>
                                        {
                                            catalogTableAttributes.map(attr =>
                                                <TableCell key ={makeKey()}>
                                                    {entry[attr.attributeDBName]}
                                                </TableCell>)
                                        }
                                        <CourseCatalogDialog courses={courses} setStudentCourses={setStudentCourses}
                                                             catalog={catalog} catIdx={catIdx} course={course}
                                                             open={open} setOpen={setOpen}
                                                             courseIdx={courseIdx}/>

                                    </TableRow>

                                        )
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>)
}

function CourseCatalogDialog({courses, setStudentCourses, catalog, course, catIdx, open, setOpen, courseIdx}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleMatch = () => {
      console.log(`Matching: ${JSON.stringify(catalog[catIdx])} to ${JSON.stringify(course)}`);
      console.log(`${catalog[catIdx].catalog}`);
      console.log(`${catIdx}`);
      let studentCourses = courses.slice();
      studentCourses[courseIdx] = {
          ...course,
          ssu_subject: catalog[catIdx].subject,
          ssu_catalog: catalog[catIdx].catalog,
          ssu_title: catalog[catIdx].course_title_long,
          ssu_units: catalog[catIdx].min_units
      }
        const api = new API();
        const courseDictionary = {
            ...studentCourses[courseIdx]
        };

        console.log(`courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleSave : ${error}`));

      console.log(`The matched course is now: ${JSON.stringify(studentCourses[courseIdx])} from row ${courseIdx}`);
      setStudentCourses(studentCourses);
      console.log(`studentCourses is now: ${JSON.stringify(studentCourses)} with length ${studentCourses.length}`);
      setDialogOpen(false);
      setOpen(!open);
    };

    const handleUnMatch = () => {
        console.log(`Matching: ${JSON.stringify(catalog[catIdx])} to ${JSON.stringify(course)}`);
        console.log(`${catalog[catIdx].catalog}`);
        console.log(`${catIdx}`);
        let studentCourses = courses.slice();
        studentCourses[courseIdx] = {
            ...course,
            ssu_subject: null,
            ssu_catalog: null,
            ssu_title: null,
            ssu_units: null
        }
        const api = new API();
        const courseDictionary = {
            ...studentCourses[courseIdx]
        };

        console.log(`courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleSave : ${error}`));

        console.log(`The matched course is now: ${JSON.stringify(studentCourses[courseIdx])} from row ${courseIdx}`);
        setStudentCourses(studentCourses);
        console.log(`studentCourses is now: ${JSON.stringify(studentCourses)} with length ${studentCourses.length}`);
        setDialogOpen(false);
        setOpen(!open);
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
        <Button onClick={handleDialogOpen('body')}>See Description</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">{catalog[catIdx]['course_title_long']}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    sx={{whiteSpace: 'pre-line'}}
                >
                    {catalog[catIdx]['catalog_description']}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                { course.ssu_catalog !== catalog[catIdx].catalog
                && course.ssu_subject !== catalog[catIdx].subject
                && course.ssu_title !== catalog[catIdx].course_title_long ?
                    (<Button onClick={handleMatch}>Match</Button> ):
                    (<Button onClick={handleUnMatch}>Unmatch</Button>)
                }
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function UploadFormDialog({course}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [userUpload, setUserUpload] = useState({
        selectedFile: null,
        selectedURL: null
    })
    const [field, setField] = useState('');

    const handleFieldChange = (event, attr) => {
        console.log(`In handleFieldChange ${event.target.value}`);
        let newField = event.target.value;
        console.log(`${JSON.stringify(newField)}`);
        let userUploadField = {
            ...userUpload,
            selectedURL: newField
        };
        setField(newField);
        setUserUpload(userUploadField);

    }

    const handleDialogOpen = (scrollType) => () => {
        setDialogOpen(true);
        setScroll(scrollType);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    async function addSyllabusURL() {
        console.log(`In addSyllabusURl ${userUpload.selectedURL}`)
        const api = new API();
        const uploadURLDictionary = {
            ...course,
            syllabus_url: userUpload.selectedURL

        }

        await api.insertSyllabusURL(uploadURLDictionary).catch(err => console.log(`Exception in addSyllabusURL: ${err}`));

    }

    const onUploadHandler = (event) => {

        console.log(event.target.files[0]);
        let userInput = {
            ...userUpload,
            selectedURL: field,
            selectedFile: event.target.files[0]
        }
        setUserUpload(userInput);
    }

    const onSubmitHandler = () => {
        const data = new FormData();
        console.log(`In onSubmitHandler: ${userUpload.selectedURL} and ${userUpload.selectedURL.length}`)
        if(userUpload.selectedURL !== null && userUpload.selectedFile === null) addSyllabusURL();
        if(userUpload.selectedFile === null) return;
        data.append('text', JSON.stringify({...course, syllabus_url: userUpload.selectedURL}))
        data.append('file', userUpload.selectedFile);
        console.log(`Data: ${data}`)
        const api = new API();
        api.uploadSyllabus(data, {student_id: 'test'}).catch(error => console.log(`Exception in CorrespondingCourses::onSubmitHandler : ${error}`));;
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
        <Button onClick={handleDialogOpen('body')}>Upload</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Upload Syllabus</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p>
                        Upload PDF
                    </p>
                    <p>
                        <input type={"file"} accept={".pdf"} onChange={onUploadHandler}/>
                    </p>
                    <p>
                        URL
                    </p>
                    <p>
                        <input type={"text"}  onChange={handleFieldChange}/>
                    </p>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={() => {onSubmitHandler()}}>Submit</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}

function AddNoteDialog({course, courses, setStudentCourses, courseIdx}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [field, setField] = useState('');
    const studentIDContext = useContext(StudentIDContext);


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
        coursesSlice[courseIdx] = {...course, student_note: field};
        const courseDictionary = {
            ...course,
            student_note: field
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
            <DialogTitle id="scroll-dialog-title">Note to Advisor</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p> You may wish to provide additional details to your advisor regarding your choice of matching
                        courses.</p>

                    <TextField
                        id="outlined-multiline-static"
                        label="Multiline"
                        multiline
                        rows={10}
                        fullWidth={true}
                        onChange={(e) => handleFieldChange(e)}
                        defaultValue={course.student_note}
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



