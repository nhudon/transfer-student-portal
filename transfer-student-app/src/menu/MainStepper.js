import React, {Fragment, useContext, useEffect, useState} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListSubheader from '@mui/material/ListSubheader';
import StudentView from '../Components/Student/StudentView';

import {MenuRoutes} from './/RouterRoutes';
import {MenuListItems} from ".//MainMenu";
import makeKey from '../utils/keyGenerator';

import {presentationComponents, containerComponents}  from './/MenuPresentationComponents';
import {StudentIDContext} from "../UserIDProviders/StudentIDProvider";
import API from "../API_Interface/API_Interface";
import LockedView from "../Components/Student/LockedView";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open' })(
    ({theme, open}) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    })
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const TopBar = ({open, handleDrawerOpen, title, user, logoutAction}) => {
    // This component is responsible for rendering the Toolbar that is drawn
    // at the top of the drawer.

    return (
        <Fragment>
            <AppBar position="fixed" open={open} >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                    <Box width="100%" justifyContent="center" flex={1}>
                        <Typography variant="h6" noWrap component="div" align="center">
                            {user}
                        </Typography>
                    </Box>
                    <Box width="40" justifyContent="right" flex={1}>
                        <Typography variant="h7" noWrap component="div" align="right" onClick={() => logoutAction()}>
                            Logout
                        </Typography>
                    </Box>

                </Toolbar>
            </AppBar>
        </Fragment>
    )
};


export default function MainStepper({title, user, logoutAction}) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [locked, setLocked] = useState()
    const [studentCase, setStudentCase] = useState([])
    const studentIDContext = useContext(StudentIDContext)
    console.log('in MainDrawer');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        const api = new API();

        async function getStudentCase() {
            const studentID = studentIDContext.studentID;
            const studentCaseJSONstring = await api.getStudentCase(studentID);
            console.log(`student from the DB ${JSON.stringify(studentCaseJSONstring.data)}`);
            setStudentCase(studentCaseJSONstring.data[0])
            setLocked(studentCaseJSONstring.data[0]['case_locked']);
        }

        getStudentCase();
    },[]);

    return (
        <Fragment>

                <TopBar title={title} open={open} handleDrawerOpen={handleDrawerOpen} user={user} logoutAction={logoutAction} />
                <CssBaseline />
            {!locked ?
                <StudentView locked={locked} setLocked={setLocked}/> : <LockedView/>
            }
        </Fragment>
    );
}