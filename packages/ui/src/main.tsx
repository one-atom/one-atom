import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Frame } from './components/frame';
import { Spacer } from './components/spacer';

ReactDOM.render(
  <Fragment>
    <Frame.h height={2000} direction='column'>
      <Frame.h alignment='center' direction='row'>
        qwe
        <Spacer.h width={40} height={40} />
        qwe
      </Frame.h>
    </Frame.h>
  </Fragment>,
  document.getElementById('app'),
);
