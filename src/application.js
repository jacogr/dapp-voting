// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Error from './error';
import ModalInfo from './modalInfo';
import ModalCloseQuestion from './modalCloseQuestion';
import ModalAccountSelector from './modalAccountSelector';
import ModalNewQuestion from './modalNewQuestion';
import ModalSearch from './modalSearch';
import Navigation from './navigation';
import Question from './question';

import styles from './index.css';

@observer
export default class Application extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    return (
      <div className={ styles.application }>
        <Navigation store={ store } />
        <Error error={ store.error } />
        <ModalAccountSelector store={ store } />
        <ModalInfo store={ store } />
        <ModalCloseQuestion store={ store } />
        <ModalNewQuestion store={ store } />
        <ModalSearch store={ store } />
        <Question store={ store } />
      </div>
    );
  }
}
