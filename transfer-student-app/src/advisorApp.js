import {Fragment} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainDrawer from './menu/MainDrawer';
import {Link, Router} from 'react-router-dom';

const makeUserName = ({advisor_fName, advisor_mName, advisor_lName}) => {
    return `${advisor_fName} ${advisor_mName === null ? '' : (advisor_mName+(advisor_mName.length === 1 ? '.' : ''))} ${advisor_lName}`;
};

const UserBanner = ({user, title, logoutAction}) => {

    return (
        <Box sx={{ display: 'flex', width: '100%', minWidth: 600, justifyContent: 'center' }}>

            <Grid sx={{ flexGrow: 1, width: '100%' }} container spacing={1}>
                <Grid item justifyContent='center' xs={12}>
                    <Typography variant="h3"  component="div">{makeUserName(user)}</Typography>
                </Grid>

                <Grid item xs={12} justifyContent='center'>
                    <Button component={Link} to={'/'} onClick={() => logoutAction()}>Logout</Button>
                </Grid>

            </Grid>
        </Box>

    )
};


export default function App({user, logoutAction}) {
    const mainPageTitle = "Advisor";

    return (
        <Fragment>
            <MainDrawer title={mainPageTitle}
                        user={makeUserName(user)}
                        logoutAction={logoutAction}/>
        </Fragment>
    )

}
