import React, {createContext, useEffect, useReducer, useState} from "react";

const StudentIDContext = createContext();


const StudentIDProvider = ({user, children}) => {
    const [studentID, setStudentID] = useState(user?.student_id);
    console.log(`In StudentIDProvider user is: ${JSON.stringify(user)}`);
    console.log(`In StudentIDProvider studentID is: ${JSON.stringify(studentID)}`);

    const ComponentToDisplay = ({children}) => {
        return <StudentIDContext.Provider value={{studentID: studentID, setStudentID: setStudentID}}>
                    {children}
                </StudentIDContext.Provider>
    };


    return (
        <React.Fragment>
            <ComponentToDisplay>
                {children}
            </ComponentToDisplay>
        </React.Fragment>
    );
};

export {StudentIDProvider, StudentIDContext}
