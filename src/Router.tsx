import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Donor from './pages/donor'
import { routes } from './routes';

const Router = () => (
  <BrowserRouter>
    <Route path={routes.donor} component={Donor}/>
  </BrowserRouter>
);

export default Router;
