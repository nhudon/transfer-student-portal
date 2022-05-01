import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";

import makeKey from '../../utils/keyGenerator';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import {completedCourseTables} from './StudentTableAttributes'
import '../../components.css';
import API from "../../API_Interface/API_Interface";
import {StudentIDContext} from '../../UserIDProviders/StudentIDProvider'
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import {TablePaginationActions} from '../ComponentUtils/TablePagination'
import HelpDialog from "../ComponentUtils/HelpDialog";
import {completedCoursesHelpText} from "../ComponentUtils/HelpTexts";

let keyID = 0;

const nextKey = () => keyID++;

//const studentID = '003531053';

export default function CompletedCourses(props) {
    
    const [transfer, setTransfer] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [testCredit, setTestCredit] = useState([]);
    const [arrUpdate, setArrUpdate] = useState([]);
    const [majorCourses, setMajorCourses] = useState([]);
    const stateArray = [transfer, majorCourses, enrollment, arrUpdate, testCredit];
    //console.log(`in CompletedCourses courses contains is ${JSON.stringify(transfer)}`);
    const studentIDContext = useContext(StudentIDContext);
    //console.log(`studentIDContext contains: ${JSON.stringify(studentIDContext)}`);
    useEffect(() => {
        const api = new API();
        async function getCourses() {
            const studentID = studentIDContext.studentID;
            const majorSubject = 'CS';
            const transferJSONString = await api.transferCourses(studentID);
            const testCreditJSONString = await api.testCreditCourses(studentID);
            const enrollmentJSONString = await api.enrollment(studentID);
            const arrUpdateJSONString = await api.arrUpdateForm(studentID);
            const majorCoursesJSONString = await api.majorCourses(studentID, majorSubject);
            console.log(`transfer courses from the DB ${JSON.stringify(transferJSONString)}`);
            console.log(`testcredit from the DB ${JSON.stringify(testCreditJSONString)}`);
            console.log(`enrollment from the DB ${JSON.stringify(enrollmentJSONString)}`);
            console.log(`arrUpdate from the DB ${JSON.stringify(arrUpdateJSONString)}`);
            console.log(`majorCourses from the DB ${JSON.stringify(majorCoursesJSONString)}`);
            setTransfer(transferJSONString.data);
            setTestCredit(testCreditJSONString.data);
            setEnrollment(enrollmentJSONString.data);
            setArrUpdate(arrUpdateJSONString.data);
            setMajorCourses(majorCoursesJSONString.data);
        }
        //console.log(completedCourseTables[0]);
        getCourses();
    }, []);



    stateArray.forEach(state => console.log(state.length));
    //return null;
    return(
        <Fragment>
            <Box className='component-column'>
                <HelpDialog dialogtext={completedCoursesHelpText}/>
            {
                completedCourseTables.map((table, state) =>
                   stateArray[state].length > 0 &&
                    <TableContainer component={Paper}>
                        <div><p className='table-title-center' >{`${table.tableName}`}</p></div>
                        <Table>
                            <CourseTableHead attributes={table.tableAttributes}/>
                            <CourseTableBody attributes = {table.tableAttributes} state={stateArray[state]}/>
                        </Table>
                        <div><br/><br/><br/></div>
                    </TableContainer>

                )

            }
            </Box>
        </Fragment>
    )
}

function CourseTableHead({attributes}){
    return (
        <Fragment>
             <TableHead>
                <TableRow key={makeKey()}>
                    {
                        attributes.map( (attr) =>
                        <TableCell key={makeKey()}>
                            {attr.attributeName}
                        </TableCell>
                        )

                    }
                </TableRow>
            </TableHead>
        </Fragment>
    )
}

function CourseTableBody({attributes, state: rows}){
    /* Table Pagination*/
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    console.log(`${JSON.stringify(rows)}`);
    return(
        <Fragment>
                <TableBody>
                    {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                    ).map((row) => (
                        <TableRow
                            key={nextKey()}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            {
                                attributes.map(attr => <TableCell key={nextKey()}
                                                                  align={attr.align}>{row[attr.attributeDBName]}</TableCell>)
                            }
                        </TableRow>
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
                        count={rows.length}
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
    )
}


