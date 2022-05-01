import React, {createContext, useState} from "react";


const AdvisorPreferenceContext = createContext();


const AdvisorPreferenceProvider = ({children}) => {
    const [showDialog, setShowDialog] = useState(true);

    const ComponentToDisplay = ({children}) => {
        return <AdvisorPreferenceContext.Provider value={{showDialog: showDialog, setShowDialog: setShowDialog}}>
            {children}
        </AdvisorPreferenceContext.Provider>
    };


    return (
        <React.Fragment>
            <ComponentToDisplay>
                {children}
            </ComponentToDisplay>
        </React.Fragment>
    );
};

export {AdvisorPreferenceProvider, AdvisorPreferenceContext}
