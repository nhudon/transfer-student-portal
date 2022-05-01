import React, { useState, Fragment } from 'react';
import { Route, Router as ReactRouter, Switch,
    useRouteMatch, useLocation, useHistory} from 'react-router-dom';
import Login from './advisorLogin';
import App from './advisorApp';

import {AdvisorIDProvider} from "./UserIDProviders/AdvisorIDProvider";

const logout = (setUser) => {
    return () => {
        setUser(undefined);
    }
};

export default function Main() {

    const [user, setUser] = useState(undefined);

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <AdvisorIDProvider user={user}>
                        <App user={user} logoutAction={logout(setUser)} />
                    </AdvisorIDProvider>
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
        </Fragment>
    )

}