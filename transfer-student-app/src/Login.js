import React, {useState, useEffect, Fragment} from 'react';
import API from './API_Interface/API_Interface';


import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {FormControl, Stack} from "@mui/material";


export default function Login({setUser}) {
    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [open, setOpen] = useState(false);
    const [studentInfo, setStudentInfo] = useState(
        {student_fName: '',
                    student_mName: '',
                    student_lName: '',
                    student_id: ''
        });
    const [noID, setNoID] = useState(false);
    const requestTokenForm = (event, attr) => {
        let newField = {
            ...studentInfo
        }

        newField[attr] = event.target.value.trim();
        setStudentInfo(newField);
    }

    async function notifyAdvisor(){
        console.log(`in notifyAdvisor`);

        const api = new API();

        let data = {
            sender: 'ssuadvisor4@gmail.com',
            receiver: 'ssuadvisor4@gmail.com',
            subject: `Access Token requested`,
            text: `${studentInfo.student_fName} ${studentInfo.student_mName === null ? '' : studentInfo.student_mName} ${studentInfo.student_lName} `
             + `(Student ID: ${studentInfo.student_id}) has requested a login access token.`
        }

        api.sendEmail(data).catch(error =>
            console.log(`Exception in emailHandler::sendEmail ${error}`)
        );

        setOpen(!open);
    }

    const handleInputChange = event => {
        console.log("handleInputChange called.");

//        event.stopPropagation();
//        event.preventDefault();

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Enter") {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
    };

    useEffect(() => {

        if( ! verifyUser || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            api.getUserInfo(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    const user = userInfo.user;
                    if( userInfo.status === "OK" ) {
                        setUser(user);
                    } else  {
                        setVerifyUser(false);
                        setAuthFailed(true);
                    }
                });
        }

        getUserInfo();
    }, [verifyUser, setUser, userInput]);


    return (
       <Fragment>
           <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={10}>

                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    label="Login name"
                    placeholder=""
                    value={userInput}
                    helperText="Only for existing users!"
                    onChange={handleInputChange}
                />
                <Divider />
           </Box>

           <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2} sx={{flexDirection: 'column'}}>
           <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => {setVerifyUser(true)}}
                >Proceed</Button>
           <br/><br/>
               { !open?
                   <Button variant="outlined"
                           size="medium" onClick={() => setOpen(!open)}>Request Access Token</Button> :
                   <FormControl varianet="standard" >
                       <Stack spacing={2} >
                           <TextField label={'Enter your student ID'} onChange={(e) => requestTokenForm(e, 'student_id')}/>
                           <TextField label={'First name'}  onChange={(e) => requestTokenForm(e, 'student_fName')}/>
                           <TextField label={'Middle initial'}  onChange={(e) => requestTokenForm(e, 'student_mName')}/>
                           <TextField label={'Last name'}  onChange={(e) => requestTokenForm(e, 'student_lName')}/>
                       </Stack>
                       <Box sx={{justifyContent: 'center', flexDirection: 'row'}}>
                           <Button onClick={notifyAdvisor}>Submit</Button>
                           <Button onClick={() => setOpen(!open)}>Cancel</Button>
                       </Box>
                   </FormControl>
               }
           </Box>

       </Fragment>

    );
}