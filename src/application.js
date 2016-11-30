// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Error from './error';
import EventsNewQuestion from './eventsNewQuestion';
import Navigation from './navigation';
import NewAnswerModal from './newAnswerModal';
import NewQuestionModal from './newQuestionModal';
import Question from './question';
import Status from './status';

import styles from './application.css';

@observer
export default class Application extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    return (
      <div className={ styles.application }>
        <Status store={ store } />
        <Navigation store={ store } />
        <NewAnswerModal store={ store } />
        <NewQuestionModal store={ store } />
        <Question store={ store } />
        <EventsNewQuestion store={ store } />
        <Error error={ store.error } />
      </div>
    );
  }
}
