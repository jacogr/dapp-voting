// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import AccountButton from './accountButton';
import Button from './button';

import styles from './index.css';

@observer
export default class Navigation extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;
    const isEmpty = store.count === 0;
    const isSingle = store.count === 1;

    return (
      <div className={ styles.navigation }>
        <div className={ styles.moveButtons }>
          <Button
            icon='arrow-left'
            label='prev'
            disabled={ isEmpty || isSingle }
            onClick={ store.prevQuestion } />
          <Button
            icon='arrow-right'
            label='next'
            disabled={ isEmpty || isSingle }
            onClick={ store.nextQuestion } />
          <Button
            icon='search'
            label='find'
            disabled={ isEmpty || isSingle }
            onClick={ this.openSearch } />
          <Button
            icon='random'
            label='random'
            disabled={ isEmpty || isSingle }
            onClick={ store.randomQuestion } />
        </div>
        <div className={ styles.actionButtons }>
          <AccountButton store={ store } />
          <Button
            icon={ store.canClose || (store.question && store.question.closed) ? 'lock' : 'unlock' }
            label='lock'
            disabled={ isEmpty || !store.canClose }
            onClick={ this.openCloseQuestion } />
          <Button
            icon='commenting'
            label='question'
            onClick={ this.openNewQuestion } />
          <Button
            icon='info'
            label='info'
            onClick={ this.openInfo } />
        </div>
      </div>
    );
  }

  openCloseQuestion = () => {
    this.props.store.toggleCloseQuestionModal();
  }

  openInfo = () => {
    this.props.store.toggleInfoModal();
  }

  openNewQuestion = () => {
    this.props.store.toggleNewQuestionModal();
  }

  openSearch = () => {
    this.props.store.toggleSearchModal();
  }
}
