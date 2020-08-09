import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';

import 'antd/dist/antd.css';
import './index.css';
import './App.scss';

ReactDOM.render(
  <BrowserRouter>
    <App style={{height: '100vh', width: '100vw'}} />
  </BrowserRouter>,
  document.getElementById('root')
);
