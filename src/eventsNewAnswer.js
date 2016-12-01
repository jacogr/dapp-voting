// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import styles from './index.css';

@observer
export default class EventsNewAnswer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.answerEvents.length) {
      return null;
    }

    return (
      <div className={ styles.eventsAnswers }>
        <div className={ styles.container }>
          { this.renderEvents() }
        </div>
      </div>
    );
  }

  renderEvents () {
    const { store } = this.props;

    return store.answerEvents.map((event) => {
      return (
        <div
          className={ `${styles.event} ${event.state === 'pending' ? styles.pending : ''} ${styles[['nay', 'yay', 'may'][event.params.answer]]}` }
          key={ event.key }>
          <i className={ `fa fa-${['thumbs-down', 'thumbs-up', 'hand-paper-o'][event.params.answer]}` } /> { api.util.fromWei(event.params.value).toFormat(3) }
        </div>
      );
    });
  }
}
