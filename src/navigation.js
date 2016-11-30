// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Button from './button';

import styles from './navigation.css';

@observer
export default class Navigation extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;
    const isEmpty = store.count === 0;

    return (
      <div className={ styles.navigation }>
        <Button label='< prev' disabled={ isEmpty } onClick={ store.prevQuestion } />
        <Button label='random' disabled={ isEmpty } onClick={ store.randomQuestion } />
        <div disabled={ isEmpty } className={ styles.inputButton }>
          <input
            disabled={ isEmpty }
            type='number'
            min='1'
            max={ store.count }
            step='1'
            value={ store.queryIndex }
            onChange={ this.changeIndex } />
          <Button label='go' disabled={ isEmpty } onClick={ this.setIndex } />
        </div>
        <Button label='next >' disabled={ isEmpty } onClick={ store.nextQuestion } />
        <div>
          <Button label='answer question' disabled={ isEmpty } onClick={ this.newAnswer } />
          <Button label='new question' onClick={ this.newQuestion } />
        </div>
      </div>
    );
  }

  changeIndex = (event) => {
    this.props.store.setQueryIndex(event.target.value);
  }

  setIndex = () => {
    this.props.store.loadQuery();
  }

  newAnswer = () => {
    this.props.store.toggleNewAnswerModal();
  }

  newQuestion = () => {
    this.props.store.toggleNewQuestionModal();
  }
}
