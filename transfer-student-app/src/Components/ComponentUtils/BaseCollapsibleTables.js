import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {DateTime} from "luxon";

import SearchBar from './SearchBar';

import {
    dateToDateString,
    dateToDatetimeString
} from '../../utils/dateTimeZoneAndFormat';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function Row(props) {
    const { row, tableSpecs, component, idAttribute } = props;
    const [open, setOpen] = useState(false);
    const [iD, setID] = useState(idAttribute);


    const makeAttributeValue = (row, cellSpec) => {
        if( cellSpec.hasOwnProperty('dateAttribute') )
            return dateToDateString(row[cellSpec.attributeDBName]);
        else if( cellSpec.hasOwnProperty('datetimeAttribute') )
            return dateToDatetimeString(row[cellSpec.attributeDBName]);
        return row[cellSpec.attributeDBName];
    };

    return (
        <React.Fragment>
                <StyledTableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                    {
                        tableSpecs.collapsible &&
                        <StyledTableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => {
                                    setOpen(!open);
                                    setID(idAttribute)
                                }}
                            >
                                {open ? <ExpandLess/> : <ExpandMore/>}
                            </IconButton>
                        </StyledTableCell>
                    }
                    {
                        tableSpecs.rowSpecs.map((cellSpec, idx) => <StyledTableCell key={cellSpec.attributeDBName}
                            component={idx === 0 ? 'th' : 'td'}>{makeAttributeValue(row, cellSpec)}</StyledTableCell>)
                    }
                </StyledTableRow>

            {tableSpecs.collapsible ?
                <TableRow
                    sx={{
                        bgcolor: 'lightgray',
                        border: 0
                    }}
                >
                    <StyledTableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={tableSpecs.rowSpecs.length + 1}>
                        <Collapse in={open && iD === idAttribute} timeout="auto" unmountOnExit>
                            <Box sx={{margin: 1}}>
                                <Paper elevation={3}>
                                      {component(row)}
                                </Paper>
                            </Box>
                        </Collapse>
                    </StyledTableCell>
                </TableRow>
                : null
            }

        </React.Fragment>
    );
}

export default function BaseCollapsibleTable({tableSpecs, rows, component, searchBarInfo, idAttribute}) {


    return (
        <React.Fragment >
        <TableContainer component={Paper}>
            <SearchBar {...searchBarInfo} />
            <Table aria-label="collapsible table" size="small">
                <TableHead style={ {height: 45}}>
                    <StyledTableRow>
                        { tableSpecs.collapsible && <StyledTableCell /> }
                        { tableSpecs.rowSpecs.map(rowSpec => <StyledTableCell align={rowSpec.align}>{rowSpec.attributeName}</StyledTableCell> )
                        }
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row[idAttribute]}
                             idAttribute={idAttribute}
                             row={row}
                             tableSpecs={tableSpecs}
                             component={component} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </React.Fragment>
    );
}