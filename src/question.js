// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import Button from './button';
import Chart from './chart';
import EventsNewAnswer from './eventsNewAnswer';

import styles from './index.css';

const STATES = ['Yes', 'No', 'Maybe'];

@observer
export default class Question extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;
    const { question, questionIndex } = store;
    const cannotVote = store.hasCurrentVoted || !question || question.closed;

    if (questionIndex === -1) {
      return null;
    }

    return (
      <div className={ styles.question }>
        <div className={ styles.header }>
          <div className={ styles.title }>
            #{questionIndex}: { question.question }
          </div>
          <div className={ styles.byline }>
            { question.votesNo.add(question.votesYes).add(question.votesMaybe).toFormat(0) } answers with a total value of { api.util.fromWei(question.valueNo.add(question.valueYes).add(question.valueMaybe)).toFormat(3) }<small>ETH</small>
          </div>
        </div>
        <div className={ styles.answerButtons }>
          <Button
            disabled={ cannotVote }
            icon='thumbs-o-up'
            label='yes'
            onClick={ this.onClickAnswerYes } />
          <Button
            disabled={ cannotVote }
            icon='hand-paper-o'
            label='maybe'
            onClick={ this.onClickAnswerMaybe } />
          <Button
            disabled={ cannotVote }
            icon='thumbs-o-down'
            label='no'
            onClick={ this.onClickAnswerNo } />
        </div>
        <div className={ styles.answers }>
          <Chart
            title='Number of Votes'
            labels={ STATES }
            values={ [
              question.votesYes.toNumber(),
              question.votesNo.toNumber(),
              question.votesMaybe.toNumber()
            ] } />
          <Chart
            title='Value of Votes'
            labels={ STATES }
            values={ [
              api.util.fromWei(question.valueYes).toNumber(),
              api.util.fromWei(question.valueNo).toNumber(),
              api.util.fromWei(question.valueMaybe).toNumber()
            ] } />
        </div>
        <EventsNewAnswer store={ store } />
      </div>
    );
  }

  onClickAnswerYes = () => {
    this.props.store.newAnswer(1);
  }

  onClickAnswerNo = () => {
    this.props.store.newAnswer(0);
  }

  onClickAnswerMaybe = () => {
    this.props.store.newAnswer(2);
  }
}
