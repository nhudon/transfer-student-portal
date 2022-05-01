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
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import SearchBar from "../ComponentUtils/SearchBar";
import {TablePaginationActions} from "../ComponentUtils/TablePagination";

const advisorStudentsTable = [
    {
        attributeName: 'Student ID',
        attributeDBName: 'student_id'
    },
    {
        attributeName: 'First Name',
        attributeDBName: 'student_fName'
    },
    {
        attributeName: 'Middle Name',
        attributeDBName: 'student_mName'
    },
    {
        attributeName: 'Last Name',
        attributeDBName: 'student_lName'
    }
];

export default function AdvisorStudents({control, setControl}) {

    const [newStudents, setNewStudents] = useState([]);
    const [studentsToDisplay, setStudentsToDisplay] = useState([]);
    console.log(`in AdvisorStudents newStudents contains is ${JSON.stringify(newStudents)}`);
    const advisorIDContext = useContext(AdvisorIDContext);
    useEffect(() => {
        const api = new API();

        async function getNewStudents() {
            const advisorID = advisorIDContext.advisorID;
            const newStudentsJSONString = await api.newTransferStudents(advisorID);
            console.log(`newStudents from the DB ${JSON.stringify(newStudentsJSONString)}`);
            setNewStudents(newStudentsJSONString.data);
            setStudentsToDisplay(newStudentsJSONString.data);
        }

        getNewStudents();
    },[]);

    const filterRows = (changeEvent) => {
        if(newStudents.length === 0 || changeEvent.target.value.trim().length === 0) {
            setStudentsToDisplay(newStudents);
            return;
        }

        const pattern = changeEvent.target.value.trim().toLocaleLowerCase();
        const rows = newStudents.filter(student => student['student_id'].toLowerCase().match(pattern) );
        setStudentsToDisplay(rows);
    };

    return (
        <Fragment>
            <Box className='component-column'>
                <TableContainer component={Paper}>
                    <div><p className='table-title-center' >New Transfer Students</p></div>
                    <SearchBar placeholder={'Filter by Student ID'} inputChangeHandler={filterRows}/>
                    <Table sx={{minWidth: 650}} aria-label="new transfer students table">
                        <NewTransferStudentsTableHead/>
                        <NewTransferStudentsTableBody
                            newStudents={studentsToDisplay}
                            control={control} setControl={setControl}
                        />
                    </Table>
                </TableContainer>
            </Box>
        </Fragment>
    )
}

function NewTransferStudentsTableHead() {
    console.log('in NewTransferStudentsTableHead');

    return (
        <Fragment>
            <TableHead>
                <TableRow key={makeKey()}>
                    {
                        advisorStudentsTable.map( (attr) =>
                            <TableCell key={makeKey()}>
                                {attr.attributeName}
                            </TableCell>
                        )
                    }
                    {
                        <TableCell key={makeKey()}>
                            Action
                        </TableCell>
                    }
                </TableRow>
            </TableHead>
        </Fragment>
    );
}

function NewTransferStudentsTableBody({control, setControl, newStudents: rows}) {
    console.log('in NewTransferStudentsTableBody');
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

    return(
        <Fragment>
            <TableBody>
                {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                ).map((row) => (
                    <NewTransferStudentsRow newStudent={row} control={control} setControl={setControl}/>
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

function NewTransferStudentsRow({newStudent, control, setControl}) {
    console.log('in NewTransferStudentsTableBody');

    const [emailInfo, setEmailInfo] = useState([]);
    const [accessToken, setAccessToken] = useState(null)
    console.log(`in NewTransferStudentsTableBody emailInfo contains is ${JSON.stringify(emailInfo)}`);
    const advisorIDContext = useContext(AdvisorIDContext);

    useEffect(() => {
        const api = new API();

        async function getEmailInfo() {
            const emailInfoJSONString = await api.studentEmailInfo(newStudent['student_id']);
            console.log(`emailInfo from the DB ${JSON.stringify(emailInfoJSONString)}`);
            setEmailInfo(emailInfoJSONString.data);
        }

        getEmailInfo();
    },[]);


    async function getAccesstoken() {
        console.log(`in getAccessToken`);
        const api = new API();
        const advisorID = advisorIDContext.advisorID;

        let studentDictionary = {
            student_id: newStudent['student_id'],
            student_fName: newStudent['student_fName'],
            student_mName: newStudent['student_mName'],
            student_lName: newStudent['student_lName'],
        }

        await api.generateToken(studentDictionary).catch(error =>
            console.log(`Exception in emailHandler::generateToken ${error}`)
        );

        const accessTokenString = await api.getStudentToken(newStudent['student_id']);
        console.log(`accessToken is: ${JSON.stringify(accessTokenString)}`);
        console.log(`accessTokenData is ${JSON.stringify(accessTokenString.data)}`);
        await setAccessToken(accessTokenString.data[0].student_access_token);
        console.log(`After setAccessToken: ${accessToken}`);

        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssustudent4@gmail.com',
            subject: 'Your student login token',
            text: `${newStudent.student_fName} ${newStudent.student_mName === null ? '' : newStudent.student_mName} ${newStudent.student_lName} login token for http://localhost:3000/student 
            \n ${accessTokenString.data[0].student_access_token}`
        }

        let caseDictionary = {
            advisor_id: advisorID,
            student_id: newStudent['student_id'],
            student_fName: newStudent['student_fName'],
            student_mName: newStudent['student_mName'],
            student_lName: newStudent['student_lName'],
            student_submission: 0,
            case_locked: 0,
            case_approved: 0

        }


        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );

        api.insertNewCase(caseDictionary).catch(error =>
            console.log(`Exception in emailHandler::insertNewCase ${error}`)
        );

        setControl(!control)

    }

    const emailHandler = () => {
        if (emailInfo === undefined)
            return;
        getAccesstoken();

    };

    return (
        <Fragment>
            <TableRow key={makeKey()}>
                {
                    advisorStudentsTable.map((attr) =>
                        <TableCell key={makeKey()}>
                            {newStudent[attr.attributeDBName]}
                        </TableCell>
                    )
                }
                <TableCell key={makeKey()}>
                    <Button onClick={() => {emailHandler ()}}>SEND ACCESS TOKEN</Button>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}
