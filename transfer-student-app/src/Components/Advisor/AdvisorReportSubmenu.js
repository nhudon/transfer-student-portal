import React, {Fragment, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    TableCell,
    TableContainer,
    TableRow,
    TextField
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TableHead from "@mui/material/TableHead";
import makeKey from "../../utils/keyGenerator";
import API from "../../API_Interface/API_Interface";
import Typography from "@mui/material/Typography";
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {AdvisorPreferenceContext} from "./AdvisorPreferences";

export default function AdvisorReportSubmenu({course, open, setOpen, setCourse, reject, setReject}){
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
            console.log(pdfFromServer)
            if(pdfFromServer === undefined || pdfFromServer.data.status === "Failed") return;
            // console.log(`Our file: ${JSON.stringify(pdfFromServer.data)}`);
            setFile(pdfFromServer.data);
        }

        getSyllabusPDF();
    },[]);

    const card = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h5" component="div">
                    Student's Note
                </Typography>
                <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                    { course.student_note !== null ?
                       course.student_note :
                        <p>No note submitted for this course.</p>
                    }
                </Typography>
            </CardContent>

        </React.Fragment>
    );






    return(
        <Fragment>
            <Box className={'report-sub-menu'}>
            <Box sx={{ position: 'inherit', marginRight: 95, justifySelf: 'left'}}>

                    <Button onClick={() => setOpen(!open)}>
                        <ArrowBackIosNewIcon sx={{fontSize: 15}}/>
                         BACK
                    </Button>

            </Box>
                    <p>Student's Course Matching</p>
                <TableContainer sx={{paddingLeft: 19, minWidth: 650}}>

                    <TableHead>
                        <TableRow key={makeKey()}>
                            <TableCell key={makeKey()}>
                                School
                            </TableCell>
                            <TableCell key={makeKey()}>
                                Subject
                            </TableCell>
                            <TableCell key={makeKey()}>
                                Catalog
                            </TableCell>
                            <TableCell key={makeKey()}>
                                Title
                            </TableCell>
                            <TableCell key={makeKey()}>
                                Units
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableRow key={makeKey()}>
                        <TableCell key={makeKey()}>
                            {course.from_school}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.from_subject}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.from_catalog}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.from_title}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.from_units}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell key={makeKey()}>
                            Sonoma State University
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.ssu_subject}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.ssu_catalog}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.ssu_title}
                        </TableCell>
                        <TableCell key={makeKey()}>
                            {course.ssu_units}
                        </TableCell>
                    </TableRow>
                </TableContainer>
                <Typography sx={{marginTop: 5}}>Syllabus</Typography>
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
                <Box sx={{textAlign: 'justify', marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10}}>
                    <StudentNote card={card}/>
                </Box>
                <AdvisorDecision course={course} setCourse={setCourse} reject={reject} setReject={setReject}/>
                </Box>
        </Fragment>
    )
}

function AdvisorDecision({course, setCourse, reject, setReject}){

    const [openNote, setOpenNote] = useState(false);
    const [field, setField] = useState('');
    const [decision, setDecision] = useState(null);

    const cancelDecisionHandler = () => {

        let updatedCourse = {
            ...course,
            rejected: null,
            advisor_note: null
        }
        const api = new API();
        api.studentSessionCourses( updatedCourse ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        setCourse(updatedCourse);
        setReject(!reject);
    }


    const rejectHandler = () => {
        setOpenNote(true);
        setDecision(1);
    }

    const approveHandler = () => {
        setOpenNote(true);
        setDecision(0);

    }

    const handleFieldChange = (event) => {
        console.log(`In handleFieldChange ${event.target.value}`);
        let newField = event.target.value;
        console.log(`${JSON.stringify(newField)}`);
        setField(newField);
    }

    console.log(`open note: ${openNote}`);
    return (
        <Fragment>
            {
                course.rejected === null && !openNote && <Box sx={{flexDirection: 'row'}}>
                    <Button  onClick={() => approveHandler()}>Looks good</Button>
                    <Button  onClick={() => rejectHandler()}>Reject</Button>
                </Box>

            }
            {
                course.rejected !== null && Boolean(course.rejected) && !openNote && <Button onClick={() => cancelDecisionHandler()}>Cancel Rejection</Button>

            }
            {
                course.rejected !== null
                && !Boolean(course.rejected)
                && !openNote
                && <Button onClick={() => cancelDecisionHandler()}>Cancel Approval</Button>
            }
            {
                openNote && <Box sx={{flexDirection: 'column', width: 650}} > <TextField
                    id="outlined-multiline-static"
                    label="Note"
                    multiline
                    rows={15}
                    fullWidth={true}
                    onChange={(e) => handleFieldChange(e)}
                    defaultValue={course.advisor_note}
                />
                    <Box sx={{flexDirection: 'row'}}>
                        <ConfirmationButton decision={decision} setDecision={setDecision} course={course}
                            field={field} setCourse={setCourse} setOpenNote={setOpenNote} openNote={openNote}
                            reject={reject} setReject={setReject}/>
                        <Button onClick={() => setOpenNote(false)}>Cancel</Button>
                    </Box>
                </Box>

            }

        </Fragment>
    )

}

function ConfirmationButton({decision, setDecision, course, setCourse, openNote, setOpenNote, field, reject, setReject}){
    const [clicked, setClicked] = useState(false);
    const preferences = useContext(AdvisorPreferenceContext);
    const showDialog = preferences.showDialog;
    console.log(`AdvisorPreference for showDialog: ${showDialog}`)

    const decisionHandler = (dec) => {

        let updatedCourse = {
            ...course,
            rejected: dec,
            advisor_note: field
        }
        const api = new API();
        api.studentSessionCourses( updatedCourse ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        setOpenNote(!openNote);
        setCourse(updatedCourse);
        setReject(!reject);
    }

    const clickHandler = () => {
        decisionHandler(decision);
    }

    return(
        <Fragment>
            {
                decision === 1 && showDialog && <WarningDialog postFunction={decisionHandler}/>
            }
            {
                decision === 1 && !showDialog && <Button onClick={() => clickHandler()}>Confirm</Button>
            }
            {
                decision === 0 &&  <Button onClick={() => clickHandler()}>Confirm</Button>

            }
        </Fragment>
    )
}


function WarningDialog({postFunction}){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [field, setField] = useState('');
    const [checked, setChecked] = useState(false);
    const preferenceContext = useContext(AdvisorPreferenceContext);

    const confirmHandler = () => {
        console.log(`In confirmHandler, checked is ${checked}`);
        if(checked) preferenceContext.setShowDialog(false);
        console.log(`AdvisorPreference for showDialog is ${preferenceContext.showDialog}`)
        handleDialogClose();
        postFunction(1);
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
        <Button onClick={handleDialogOpen('body')}>Confirm</Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Confirm Rejection</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <p>Are you sure you want to reject this course?</p>
                    <p>This may affect the student's eligibility for enrollment.</p>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <FormControlLabel control={<Checkbox onClick={() => {setChecked(true)}}/>} label={'Don\'t show this again'}/>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={() => {confirmHandler()}}>Submit</Button>
            </DialogActions>
        </Dialog>
    </Fragment>)
}


function StudentNote({card}) {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
}
