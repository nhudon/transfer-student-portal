import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"
import '../../components.css';
import API from "../../API_Interface/API_Interface";
import {additionalCoursesTableAttributes} from "./StudentTableAttributes";
import {StudentIDContext} from "../../UserIDProviders/StudentIDProvider";
import {
    Button, FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import makeKey from "../../utils/keyGenerator";
import { Checkbox } from '@mui/material';
import {TablePaginationActions} from "../ComponentUtils/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import HelpDialog from "../ComponentUtils/HelpDialog";
import {additionalMajorCoursesHelpText} from "../ComponentUtils/HelpTexts";

export default function AdditionalCourses({additionalCourses, setAdditionalCourses, noneApply, setNoneApply, handleNext}) {
    const [nonArticulated, setNonArticulated] = useState([]);
    const [control, setControl] = useState(false);
    const studentIDContext = useContext(StudentIDContext);
    console.log(`In AdditionalCourses`);

    useEffect(() => {
        const api = new API();
        async function getCourses() {
            console.log(`In AdditionalCourses::getCourses`);
            const studentID = studentIDContext.studentID;
            const transferJSONString = await api.nonarticulatedCourses(studentID);
            console.log(`nonarticulated courses from the DB ${JSON.stringify(transferJSONString.data)}`);
            const additionalCoursesJSONstring = await api.getAdditionalCourses(studentID);
            const additionalCoursesArray = additionalCoursesJSONstring.data;
            let newNonArticulated = transferJSONString.data;
            console.log(`nonArticulated before: ${JSON.stringify(nonArticulated)}`);
            if(additionalCoursesArray.length > 0) {
                for (let i = 0; i < additionalCoursesArray.length; i++) {
                    for (let j = 0; j < newNonArticulated.length; j++) {
                        if (additionalCoursesArray[i].from_subject === newNonArticulated[j].from_subject
                            && additionalCoursesArray[i].from_catalog === newNonArticulated[j].from_catalog &&
                            additionalCoursesArray[i].from_units === newNonArticulated[j].from_units) {
                            console.log(`matching additional course = ${JSON.stringify(additionalCoursesArray[i])}`);
                            newNonArticulated[j] = {
                                ...additionalCoursesArray[i],
                                checked: Boolean(additionalCoursesArray[i].status)
                            }
                            console.log(`newAdditionalCourse: ${JSON.stringify(newNonArticulated[j].checked)}`)
                        }
                    }
                }
            }
            console.log(`nonArticulated after: ${JSON.stringify(newNonArticulated)}`);
            setNonArticulated(newNonArticulated);


            // setNonArticulated(transferJSONString.data);
            // setControl(!control);
        }

        getCourses();
    }, [control]);




    const handleSubmit = () => {
        console.log(`CurrentCourses::handleSubmit is called`)
        const studentID = studentIDContext.studentID;
        const api = new API();
        additionalCourses.forEach((course) => {
            api.insertAdditionalCourses(
                {
                    student_id: studentID,
                    from_subject: course.from_subject.trim(),
                    from_catalog: course.from_catalog,
                    from_title: course.from_title.trim(),
                    from_units: course.from_units,

                }
            ).catch(error => console.log(`Exception in CurrentCourses::handleSubmit : ${error}`));
        });
    }

    const noneApplyHandler = () => {
        setNoneApply(!noneApply);
        if(!noneApply) handleNext();
    }



    return (
       nonArticulated !== undefined && <Fragment>
            <Box className='component-column'>
                <HelpDialog dialogtext={additionalMajorCoursesHelpText}/>
                <TableContainer component={Paper}>
                    <div><p className='table-title-center'>Additional Major Courses</p></div>
                    <Table sx={{minWidth: 650}} aria-label="current course table">
                        <AdditionalCoursesTableHead/>
                        <AdditionalCoursesTableBody
                            courses={nonArticulated}
                            setNonArticulated={setNonArticulated}
                            control={control}
                            setControl={setControl}
                        />
                    </Table>
                </TableContainer>
                {
                    <FormControlLabel sx={{justifyContent: "center"}} control={
                        <Checkbox checked={noneApply} onClick={() => {noneApplyHandler()}}/>
                    } label={'None Apply'}/>
                }
                <div><br/><br/><br/></div>
                <div><br/><br/><br/></div>

            </Box>

        </Fragment>
    )
}

function AdditionalCoursesTableHead(){
    console.log('in AdditionalCoursesTableHead');
    return (
        <Fragment>
            <TableHead>
                <TableRow key={makeKey}>
                    {
                        additionalCoursesTableAttributes.map( attr =>
                            <TableCell key={makeKey()}>
                                {attr.attributeName}
                            </TableCell>
                        )
                    }
                    <TableCell key={makeKey()}>
                        Action
                    </TableCell>
                </TableRow>
            </TableHead>
        </Fragment>
    );
}

function AdditionalCoursesTableBody({courses, setNonArticulated, control, setControl}) {
    console.log('in AdditionalCoursesTableBody');

    /* Table Pagination*/
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courses.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    console.log(`${JSON.stringify(courses)}`);
    return(
        <Fragment>
            <TableBody>
                {(rowsPerPage > 0
                        ? courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : courses
                ).map((course, rowIdx) => (
                    <CheckableRows course={course}
                                   courses={courses}
                                   setNonArticulated={setNonArticulated}
                                   rowIdx={rowIdx + page * rowsPerPage} courses={courses}
                                   control={control}
                                   setControl={setControl}/>

                ))}

                {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={courses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        </Fragment>
    );
}


function CheckableRows ({course, rowIdx, control, setControl, setNonArticulated, courses}){
    const [checked, setChecked] = useState(course['checked']);

    async function updateAdditionalCourse(){
        const api = new API();

        // console.log(`course selected for delete: ${JSON.stringify(currentCourses[courseIDx])}`);
        const courseDictionary = {
            ...course,
            ssu_catalog: null,
            ssu_subject: null,
            ssu_title: null,
            ssu_units: null,
            student_note: null,
            advisor_note: null,
            rejected: null,
            from_additional_courses: 1,
            from_current_courses: 0,
            status: +!checked
        };

        console.log(`in hupdateAdditionalCourse courseDictionary sent to the api: ${JSON.stringify(courseDictionary)}`);

        await api.studentSessionCourses( courseDictionary ).catch(error => console.log(`Exception in AdditionalCourses::updateAdditionalCourse : ${error}`));
    }
    const handleCheck = () => {
        console.log(`In CheckableRows::handleCheck`);
        console.log(`Course is in rowIdx ${rowIdx}`);
        console.log(`${JSON.stringify(course)}`);
        setChecked(!checked);
        let newCourses = courses.slice();
        newCourses[rowIdx] = {...course, checked: !checked};
        console.log(`Our new checked course is: ${JSON.stringify(newCourses[rowIdx])}`);
        updateAdditionalCourse();
        setNonArticulated(newCourses);
        console.log(`additionalCourses now contains: ${JSON.stringify(newCourses)}`)
        setControl(!control);
    }


    return (
        <Fragment>
            <TableRow key={makeKey()}>
                {
                    additionalCoursesTableAttributes.map((attr, colIdx) =>
                        <TableCell key={attr + colIdx + '_checkableCell'}>
                            {course[attr.attributeDBName]}
                        </TableCell>
                    )
                }
                <TableCell key={rowIdx + '_checkBox'}>
                    <Checkbox checked={course['checked']}
                              onChange={handleCheck}/>
                </TableCell>
            </TableRow>
        </Fragment>
    )

}




