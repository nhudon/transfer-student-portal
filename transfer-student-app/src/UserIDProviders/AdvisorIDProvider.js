import React, {createContext, useEffect, useReducer, useState} from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { DateTime } from 'luxon';

import API from "../API_Interface/API_Interface";



const AdvisorIDContext = createContext();

let lastNCycleIDs = undefined;
const numCycleIDsToGet = 5;

const AdvisorIDProvider = ({user, children}) => {
    const [advisorID, setAdvisorID] = useState(user?.advisor_id);
    console.log(`In AdvisorIDProvider user is: ${JSON.stringify(user)}`);
    console.log(`In AdvisorIDProvider studentID is: ${JSON.stringify(advisorID)}`);

    const ComponentToDisplay = ({children}) => {
        return <AdvisorIDContext.Provider value={{advisorID: advisorID, setAdvisorID: setAdvisorID}}>
            {children}
        </AdvisorIDContext.Provider>
    };


    return (
        <React.Fragment>
            <ComponentToDisplay>
                {children}
            </ComponentToDisplay>
        </React.Fragment>
    );
};

export {AdvisorIDProvider, AdvisorIDContext}
