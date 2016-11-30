// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Chart from './chart';
import EventsNewAnswer from './eventsNewAnswer';

import styles from './question.css';

const { api } = window.parity;

@observer
export default class Question extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;
    const { answerEvents, question, questionIndex } = store;

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
            { question.votesNo.add(question.votesYes).toFormat(0) } answers with a total value of { api.util.fromWei(question.valueNo.add(question.valueYes)).toFormat(3) }<small>ETH</small>
          </div>
        </div>
        <div className={ styles.answers }>
          <Chart
            labels={ [ 'Yes Votes', 'No Votes' ] }
            values={ [
              question.votesYes.toNumber(), question.votesNo.toNumber()
            ] } />
          <Chart
            labels={ [ 'Yes Value', 'No Value' ] }
            values={ [
              api.util.fromWei(question.valueYes).toNumber(), api.util.fromWei(question.valueNo).toNumber()
            ] } />
        </div>
        <EventsNewAnswer events={ answerEvents } />
      </div>
    );
  }
}
