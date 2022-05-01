import React, {useState, useEffect, useContext, Fragment} from 'react';
import AdvisorHome from "./AdvisorHome";
import AdvisorReport from "./AdvisorReport";

import {
    Route,
    Router as ReactRouter,
    Switch,
    Link,
    useRouteMatch,
    useLocation,
    useHistory,
    Redirect
} from 'react-router-dom';
import {AdvisorPreferenceProvider} from "./AdvisorPreferences";

export default function AdvisorView(props){
    let match = useRouteMatch();

    return (
        <Fragment>
            <AdvisorPreferenceProvider>
                <Switch>
                    <Route exact path={match.path} >
                        <AdvisorHome/>
                    </Route>
                    <Route path={`${match.path}/student_report/:studentID`} >
                        <AdvisorReport/>
                    </Route>
                </Switch>
            </AdvisorPreferenceProvider>
        </Fragment>
    )
}
