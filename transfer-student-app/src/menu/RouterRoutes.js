import React, {Fragment} from "react";

import { Route, Router as ReactRouter, Switch,
        useRouteMatch, useLocation, useHistory} from 'react-router-dom';

import {presentationComponents, containerComponents} from './MenuPresentationComponents';
import makeKey from '../utils/keyGenerator';


const MakeMenuRoutes = ({menuItems, pathPrefix}) => {

    return menuItems.map(compDesc => {
        return compDesc.expandable ?
            <Fragment>
                <Route exact path={pathPrefix.length === 0 ?
                                        `/${compDesc.path}` :
                                        `/${pathPrefix}/${compDesc.path}`}
                              key={makeKey()}>
                    { compDesc.component }

                </Route>
                <MakeMenuRoutes menuItems={compDesc.subItems}
                                pathPrefix={compDesc.path}
                                 />
            </Fragment>
        : <Route exact path={pathPrefix.length === 0 ?
                        `/${compDesc.path}` :
                        `/${pathPrefix}/${compDesc.path}`}
                     key={makeKey()}  >
                { compDesc.component }
        </Route>
    });
};

const MenuRoutes = (props) => {
    let match = useRouteMatch();
    let location = useLocation();
    let history = useHistory();

    return <ReactRouter initialEntries={['/summary']} initialIndex={0}  location={location} history={history}>
            <Switch location={location} key={makeKey()}>
                <MakeMenuRoutes match={match} menuItems={presentationComponents()} pathPrefix="" key={makeKey()} />
            </Switch>
          </ReactRouter>
};


export {MenuRoutes};