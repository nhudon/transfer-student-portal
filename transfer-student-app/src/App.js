import {Fragment} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainDrawer from './menu/MainDrawer';

const makeUserName = ({student_fName, student_mName, student_lName}) => {
    return `${student_fName} ${student_mName === undefined ? '' : (student_mName+(student_mName.length === 1 ? '.' : ''))} ${student_lName}`;
};

const UserBanner = ({user, title, logoutAction}) => {

    return (
        <Box sx={{ display: 'flex', width: '100%', minWidth: 600, justifyContent: 'center' }}>

        <Grid sx={{ flexGrow: 1, width: '100%' }} container spacing={1}>
            <Grid item justifyContent='center' xs={12}>
                <Typography variant="h3"  component="div">{makeUserName(user)}</Typography>
            </Grid>

            <Grid item xs={12} justifyContent='center'>

                <Button onClick={() => logoutAction()}>Logout</Button>
            </Grid>

        </Grid>
        </Box>

    )
};


export default function App({user, logoutAction}) {
    const mainPageTitle = "Student";

    return (
        <Fragment>
                <MainDrawer title={mainPageTitle}
                            user={makeUserName(user)}
                            logoutAction={logoutAction}/>
        </Fragment>
    )

}
