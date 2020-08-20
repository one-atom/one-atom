import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ResetCss } from './';
import { Home } from './doc/routes/home';
import { Buttons } from './doc/routes/buttons';

ReactDOM.render(
  <Fragment>
    <ResetCss.h />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home.h />} />
        <Route path='/buttons' element={<Buttons.h />} />
      </Routes>
    </BrowserRouter>
  </Fragment>,
  document.getElementById('app'),
);
