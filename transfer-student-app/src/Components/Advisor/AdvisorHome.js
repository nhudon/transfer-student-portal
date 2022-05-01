import React, {useState, useEffect, useContext, Fragment} from 'react';
import Box from '@mui/material/Box';
import AdvisorStudents from "./AdvisorStudents";
import AdvisorCases from "./AdvisorCases"

export default function AdvisorView(props){
    const [students, setStudents] = useState([]);
    const [control, setControl] = useState(false);
    return (
        <Fragment>
            <Box className={'advisor-column'}>

                <AdvisorStudents control={control} setControl={setControl}/>
                <AdvisorCases setControl={setControl} control={control}/>

                <div><br/><br/><br/><br/><br/><br/></div>
            </Box>
        </Fragment>
    )
}