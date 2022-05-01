import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import {
    Button, Checkbox, FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {currentCoursesTable} from "./StudentTableAttributes";
import {SaveButton} from '../ComponentUtils/SaveButton'
import '../../components.css';
import makeKey from "../../utils/keyGenerator";
import API from "../../API_Interface/API_Interface";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import HelpDialog from "../ComponentUtils/HelpDialog";
import {currentCoursesHelpText} from "../ComponentUtils/HelpTexts";


export default function CurrentCourses({handleNext, courses : currentCourses, setCourses, confirm, setConfirm}) {
    const studentIDContext = useContext(StudentIDContext);


    useEffect(() => {
        const api = new API();
        async function getCurrentCourses() {
            console.log(`getCurrentCourses is called`);
            const studentID = studentIDContext.studentID;
            const currentCoursesJSONstring = await api.getCurrentCourses(studentID);
            console.log(`In CurrentCourses: currentCoursesJSONString from db is: ${JSON.stringify(currentCoursesJSONstring.data)}`);
            setCourses(currentCoursesJSONstring.data);
        }
        getCurrentCourses();
    }, []);
    console.log(confirm);
    return(
        <Fragment>
            {
                confirm || currentCourses.length > 0 ? ( <CurrentCoursesMatchPage courses={currentCourses} setCourses={setCourses}/> )
                    : ( <CurrentCoursesGreeting confirm={confirm} setConfirm={setConfirm} handleNext={handleNext}/> )
            }
        </Fragment>
    )
}

function CurrentCoursesGreeting({confirm, setConfirm, handleNext}){
    const onClickHandler = (conf) => {
        setConfirm(conf);
        if(!conf) handleNext();
    }
    return(
        <Fragment>
            <Box className={'component-column'}>
                <p>Are you currently enrolled in courses related to your major?</p>
                <FormControlLabel control={<Checkbox checked={confirm} onClick={() => {onClickHandler(true)}}/>} label={'Yes'}/>
                <FormControlLabel control={<Checkbox checked={confirm !== null && !confirm} onClick={() => {onClickHandler(false)}}/>} label={'No'}/>
            </Box>
        </Fragment>
    )
}



function CurrentCoursesMatchPage({courses : currentCourses, setCourses}){
    console.log('in CurrentCourses');

    const [control, setControl] = useState(false);

    const studentIDContext = useContext(StudentIDContext);

    const [field, setField] = useState({
        from_school: '',
        from_subject: '',
        from_catalog: '',
        from_title: '',
        from_units:''
    });

    const setInitialField = () => {
        setField({
            from_school: '',
            from_subject: '',
            from_catalog: '',
            from_title: '',
            from_units:''
        })
    };



    const handleFieldChange = (event, attr) => {
        console.log(`In handleFieldChange ${event.target.value}`);
        let newField = { ...field };
        newField[attr] = event.target.value;
        console.log(`${JSON.stringify(newField)}`);
        setField(newField);
    }

    const addCourse = () => {
        console.log('addCourse called');
        let courses = currentCourses.slice();
        let newCourse = {
            ...field
        };

        console.log(`newCourse is: ${JSON.stringify(newCourse)}`);
        courses.push(newCourse);
        setCourses(courses);
        const studentID = studentIDContext.studentID;
        const api = new API();
        const courseDictionary = {
            course_key: null,
            student_id: studentID,
            from_school: field.from_school.trim(),
            from_subject: field.from_subject.trim(),
            from_catalog: field.from_catalog.trim(),
            from_title: field.from_title.trim(),
            from_current_courses: 1,
            from_additional_courses: 0,
            from_units: field.from_units,
            rejected: null,
            status: 1
        };

        console.log(`courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        setControl(!control);
        setInitialField();
    }

    const handleSubmit = () => {
        console.log(`CurrentCourses::handleSubmit is called`)
        const studentID = studentIDContext.studentID;
        const api = new API();
        currentCourses.forEach((course) => {
            api.insertCurrentCourses(
                {
                    student_id: studentID,
                    from_subject: course.from_subject.trim(),
                    from_catalog: course.from_catalog.trim(),
                    from_title: course.from_title.trim(),
                    from_current_courses: 1,
                    from_additional_courses: 0,
                    from_units: course.from_units
                }
            ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        });
    }

    return (
        <Fragment>

            <Box className='component-column'>
                <HelpDialog dialogtext={currentCoursesHelpText}/>
                <TableContainer component={Paper}>
                    <div><p className='table-title-center'>Current CS and Math Courses</p></div>
                    <Table sx={{minWidth: 650}} aria-label="current course table">
                        <CurrentCoursesTableHead/>
                        <CurrentCoursesTableBody
                            currentCourses={currentCourses}
                            setCourses={setCourses}
                            contol={control}
                            setControl={setControl}
                        />
                    </Table>
                </TableContainer>
                <div><br/><br/><br/></div>
                <Box className='component-row'>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_school')}
                               value={field['from_school']}
                               label="School"/>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_subject')}
                               value={field['from_subject']}
                               label="Subject"/>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_catalog')}
                               value={field['from_catalog']}
                               label="Catalog Number"/>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_title')}
                               value={field['from_title']}
                               label="Course Title"/>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_units')}
                               value={field['from_units']}
                               label="Units"/>
                    <Button variant="outlined" onClick={addCourse}>Add Course</Button>
                </Box>
                <SaveButton postFunction={handleSubmit}/>
                <div><br/><br/><br/></div>

            </Box>
        </Fragment>
    )
}

function CurrentCoursesTableHead(){
    console.log('in CurrentCoursesTableHead');

    return (
        <Fragment>
            <TableHead>
                <TableRow key={makeKey}>
                    {
                        currentCoursesTable.map( attr =>
                            <TableCell key={makeKey()}>
                                {attr.attributeName}
                            </TableCell>
                        )
                    }
                    <TableCell key={makeKey()}>
                            Actions
                    </TableCell>
                </TableRow>
            </TableHead>
        </Fragment>
    );
}

function CurrentCoursesTableBody({currentCourses, setCourses, control, setControl}) {
    console.log('in CurrentCoursesTableBody');

    const [edit, setEdit] = useState(false);
    const [rowsToEdit, setRowsToEdit] = useState([]);

    const handleDelete = (courseIDx) => {
        let courses = currentCourses.slice();
        const api = new API();
        console.log(`course selected for delete: ${JSON.stringify(currentCourses[courseIDx])}`);
        const courseDictionary = {
            ...courses[courseIDx],
            status: 0
        };

        console.log(`in handleDelete courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleDelete : ${error}`));
        courses.splice(courseIDx, 1);
        setCourses(courses);
        setControl(!control);
    };

    const handleEdit = (rowIdx) => {
        let rows = rowsToEdit.slice();
        rows[rowIdx] = true;
        setRowsToEdit(rows);
        setEdit(!edit);
    };

    return (
        <Fragment>
            <TableBody>
                {
                    currentCourses.map((course, rowIdx) =>
                       rowsToEdit[rowIdx] !== undefined && rowsToEdit[rowIdx] ? <CurrentCourseRowEditable
                               currentCourses = {currentCourses}
                               course={course}
                               control={control}
                               setCourses={setCourses}
                               setControl={setControl}
                               setEdit={setEdit}
                               rowIdx={rowIdx}
                               rowsToEdit={rowsToEdit}
                               setRowToEdit={setRowsToEdit}/> :
                                <CurrentCourseRowReadOnly
                                course={course}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                rowIdx={rowIdx} />
                    )
                }
            </TableBody>
        </Fragment>
    );
}

function CurrentCourseRowReadOnly ({course, handleEdit, handleDelete, rowIdx}){
    console.log('in CurrentCoursesRow');

    return (
        <Fragment>
            <TableRow key={makeKey()}>
                {
                    currentCoursesTable.map((attr, colIdx) =>
                        <TableCell key={makeKey()}>
                            {course[attr.attributeCourseName]}
                        </TableCell>
                    )
                }
                <TableCell key={makeKey()}>
                    <Button onClick={() => handleEdit(rowIdx)}>Edit</Button>
                    <Button onClick={() => handleDelete(rowIdx)}>Delete</Button>
                </TableCell>
            </TableRow>
        </Fragment>
    )

}

function CurrentCourseRowEditable ({currentCourses, setCourses, control, setControl, course, rowsToEdit, setEdit, setRowToEdit, rowIdx}){
    console.log('in CurrentCoursesRowEditable');

    const [field, setField] = useState({ ...course });

    const handleFieldChange = (event, attr) => {
        console.log(`In handleFieldChange ${event.target.value}`);
        let newField = { ...field };
        newField[attr] = event.target.value;
        console.log(`${JSON.stringify(newField)}`);
        setField(newField);
    };

    async function updateCurrentCourse(course){
        const api = new API();
        const courseDictionary = {
            ...course,
        };

        console.log(`courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        await api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in CurrentCourses::handleSave : ${error}`));
    }

    const handleSave = (rowIdx) => {
        let rows = rowsToEdit.slice()
        rows[rowIdx] = false;
        let courses = currentCourses.slice();
        courses[rowIdx] = {...courses[rowIdx], ...field};
        console.log(`${JSON.stringify(courses[rowIdx])}`)
        updateCurrentCourse(courses[rowIdx]);
        setEdit(false);
        setRowToEdit(rows);
        setCourses(courses);
        setControl(!control);
    };

    const handleCancel = (rowIdx) => {
        let rows = rowsToEdit.slice()
        rows[rowIdx] = false;
        setEdit(false);
        setRowToEdit(rows);
    };

    return (
        <Fragment>
            <TableRow key={rowIdx + '_CurrentformFill'}>
                <TableCell key={rowIdx + '_CurrentCourseSchool'}>
                    <TextField
                        onChange={(e) => handleFieldChange(e, 'from_school')}
                        value={field['from_school']}
                        label="school"/>
                </TableCell>
                <TableCell key={rowIdx + '_CurrentCourseSubject'}>
                    <TextField
                        onChange={(e) => handleFieldChange(e, 'from_subject')}
                        value={field['from_subject']}
                        label="Subject"/>
                </TableCell>
                <TableCell key={rowIdx + '_CurrentCourseCatalogNumber'}>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_catalog')}
                               value={field['from_catalog']}
                               label="Catalog Number"/>
                </TableCell>
                <TableCell key={rowIdx + '_CurrentCourseTitle'}>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_title')}
                               value={field['from_title']}
                               label="Course Title"/>
                </TableCell>
                <TableCell key={rowIdx + '_CurrentCourseUnits'}>
                    <TextField onChange={(e) => handleFieldChange(e, 'from_units')}
                               value={field['from_units']}
                               label="Units"/>
                </TableCell>
                <TableCell key={rowIdx + '_CurrentCourseButtons'}>
                    <Button onClick={() => handleSave(rowIdx)}>Save</Button>
                    <Button onClick={() => handleCancel(rowIdx)}>Cancel</Button>
                </TableCell>

            </TableRow>
        </Fragment>
    )

}

