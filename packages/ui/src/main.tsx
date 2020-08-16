import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './doc/routes/home';
import { ResetCss } from './';

ReactDOM.render(
  <Fragment>
    <ResetCss.h />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home.h />} />
      </Routes>
    </BrowserRouter>
  </Fragment>,
  document.getElementById('app'),
);
