// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import ReactDOM from 'react-dom';
import React from 'react';

import Application from './application';
import Store from './store';

import '../assets/fonts/Roboto/font.css';
import '../assets/images/vote.jpg';
import './index.css';
import './index.html';

const store = new Store();

ReactDOM.render(
  <Application store={ store } />,
  document.querySelector('#container')
);
