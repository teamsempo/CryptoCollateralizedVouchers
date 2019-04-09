import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Donor from './pages/donor'
import Recipient from "./pages/recipient"
import { routes } from './routes';
import {Network} from "./index";


const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path={routes.recipient}
        component={Recipient}
      />
      <Route
        component={Donor}
      />
    </Switch>
  </BrowserRouter>
);

export default Router;
