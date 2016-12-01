// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

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
        <Button
          icon='arrow-left'
          label='prev'
          disabled={ isEmpty || isSingle }
          onClick={ store.prevQuestion } />
        <Button
          className={ styles.spaced }
          icon='arrow-right'
          label='next'
          disabled={ isEmpty || isSingle }
          onClick={ store.nextQuestion } />
        <Button
          icon='info'
          label='help'
          onClick={ this.openInfo } />
        {
          !isEmpty && store.canClose
            ? <Button
              icon='lock'
              label='lock'
              onClick={ this.openCloseQuestion } />
            : null
        }
        <Button
          icon='microphone'
          label='answer'
          disabled={ isEmpty || !store.question || store.question.closed }
          onClick={ this.openNewAnswer } />
        <Button
          className={ styles.spaced }
          icon='commenting'
          label='question'
          onClick={ this.openNewQuestion } />
        <Button
          icon='random'
          label='random'
          disabled={ isEmpty || isSingle }
          onClick={ store.randomQuestion } />
        <Button
          icon='search'
          label='find'
          disabled={ isEmpty || isSingle }
          onClick={ this.openSearch } />
      </div>
    );
  }

  openCloseQuestion = () => {
    this.props.store.toggleCloseQuestionModal();
  }

  openInfo = () => {
    this.props.store.toggleInfoModal();
  }

  openNewAnswer = () => {
    this.props.store.toggleNewAnswerModal();
  }

  openNewQuestion = () => {
    this.props.store.toggleNewQuestionModal();
  }

  openSearch = () => {
    this.props.store.toggleSearchModal();
  }
}
