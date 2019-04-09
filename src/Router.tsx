import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Donor from './pages/donor'
import { routes } from './routes';
import {Network} from "./index";


interface Props {
  approve: any,
  wrapCoin: any
}
const Router = (props: Props) => (
  <BrowserRouter>
    <Route
      path={routes.donor}
      component={Donor}
      approve={(amount: number) => props.approve(amount)}
      wrapCoin={(amount: number) => props.wrapCoin(amount)}
    />
  </BrowserRouter>
);

export default Router;
