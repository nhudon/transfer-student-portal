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
import AdvisorReport from "./AdvisorReport";
import RefreshIcon from '@mui/icons-material/Refresh';

import {
    Route,
    Router as ReactRouter,
    Switch,
    Link,
    useRouteMatch,
    useLocation,
    useHistory,
    Redirect
} from 'react-router-dom';
import {AdvisorPreferenceContext} from "./AdvisorPreferences";
import TablePagination from "@mui/material/TablePagination";
import {TablePaginationActions} from "../ComponentUtils/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import SearchBar from "../ComponentUtils/SearchBar";

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

export default function AdvisorCases({setControl, control}) {

    const [cases, setCases] = useState([]);
    const [casesToDisplay, setCasesToDisplay] = useState([])
    console.log(`in AdvisorCases cases contains is ${JSON.stringify(cases)}`);
    console.log(`control is: ${control}`);
    const advisorIDContext = useContext(AdvisorIDContext);




    useEffect(() => {
        const api = new API();

        async function getActiveCases() {
            console.log(`getActiveCases is called`)
            const advisorID = advisorIDContext.advisorID;
            const activeCasesJSONstring = await api.getActiveCases(advisorID);
            console.log(`cases from the DB ${JSON.stringify(activeCasesJSONstring)}`);
            setCases(activeCasesJSONstring.data);
            setCasesToDisplay(activeCasesJSONstring.data)
        }

        getActiveCases();
    },[control]);

    const filterRows = (changeEvent) => {
        if(cases.length === 0 || changeEvent.target.value.trim().length === 0) {
            setCasesToDisplay(cases);
            return;
        }

        const pattern = changeEvent.target.value.trim().toLocaleLowerCase();
        const rows = cases.filter(student => student['student_id'].toLowerCase().match(pattern) );
        setCasesToDisplay(rows);
    };

    return ( cases.length > 0 &&
        <Fragment>
            <Box className='component-column'>
                <TableContainer component={Paper}>
                    <div><Button onClick={() => setControl(!control)}><RefreshIcon sx={{color: 'blue'}}/></Button><p className='table-title-center' >Pending Cases</p></div>
                    <Box sx={{flexDirection: 'row'}}>
                        <SearchBar placeholder={'Filter by Student ID'} inputChangeHandler={filterRows}/>
                    </Box>
                    <Table sx={{minWidth: 650}} aria-label="new transfer students table">
                        <CaseTableHead/>
                        <CaseTableBody cases={casesToDisplay}/>
                    </Table>
                </TableContainer>
            </Box>
        </Fragment>
    )
}

function CaseTableHead() {
    console.log('in CaseTableHead');

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

function CaseTableBody({cases: rows}) {
    console.log('in CaseTableBody');
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
    return (
        <Fragment>
            <TableBody>
                {rows.map((activeCase) => (
                    <CaseTableRow activeCase={activeCase}/>
                ))}
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

function CaseTableRow({activeCase}) {
    console.log('in CaseTableBody');
    const [student, setStudent] = useState(null);
    const {path, url}  = useRouteMatch();
    let location = useLocation();
    let history = useHistory();

    return (
        <Fragment>
            <TableRow key={makeKey()}>
                {
                    advisorStudentsTable.map((attr) =>
                        <TableCell key={makeKey()}>
                            {activeCase[attr.attributeDBName]}
                        </TableCell>
                    )
                }
                {
                    Boolean(!activeCase['student_submission']) ? <TableCell key={makeKey}>
                            <Button sx={{borderStyle: 'solid', borderWidth:2, fontSize: 'small', color: 'red'}}>
                        Submission Pending
                            </Button>
                    </TableCell> : Boolean(!activeCase['case_approved']) ?
                        <TableCell key={makeKey}>
                            <Button component={Link} to={`${url}/student_report/${activeCase['student_id']}`}
                                sx={{borderStyle: 'solid', borderWidth:2}}>
                                Review Case
                            </Button>
                        </TableCell> : <TableCell key={makeKey}>
                            <Button component={Link} to={`${url}/student_report/${activeCase['student_id']}`}
                                    sx={{borderStyle: 'solid', borderWidth:2, fontSize: "small", color: 'green'}}>
                                Case Approved
                            </Button>
                        </TableCell>

                }
            </TableRow>
            {
                student !== null &&
                        <AdvisorReport student={student}/>

            }

        </Fragment>
    )
}


