// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React from 'react';
import ReactDOM from 'react-dom';
import { defaults as chartjsDefaults } from 'react-chartjs-2';
import { merge } from 'lodash';

import Application from './application';
import Store from './store';

import '../assets/fonts/font-awesome-4.7.0/css/font-awesome.css';
import '../assets/fonts/Roboto/font.css';
import '../assets/images/vote.jpg';
import './index.css';
import './index.html';

merge(chartjsDefaults, {
  global: {
    defaultFontSize: 16
  }
});

const store = new Store();

ReactDOM.render(
  <Application store={ store } />,
  document.querySelector('#container')
);
