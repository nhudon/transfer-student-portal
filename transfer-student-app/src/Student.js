
import React, { useState, Fragment } from 'react';
import { Route, Router as ReactRouter, Switch,
    useRouteMatch, useLocation, useHistory} from 'react-router-dom';
import Login from './Login';
import StudentApp from './studentApp';

import {StudentIDProvider} from './UserIDProviders/StudentIDProvider';

const logout = (setUser) => {
    return () => {
        setUser(undefined);
    }
};

export default function Main() {

    const [user, setUser] = useState(undefined);
    if(user !== undefined) console.log(user);
    return (
        <Fragment>
            {
                user !== undefined ? (
                    <StudentIDProvider user={user}>
                        <StudentApp user={user} logoutAction={logout(setUser)} />
                    </StudentIDProvider>
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
        </Fragment>
    )

}