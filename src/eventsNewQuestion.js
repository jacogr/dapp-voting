// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { formatBlockTimestamp } from './format';

import styles from './index.css';

@observer
export default class EventsNewQuestion extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    onClick: PropTypes.func
  }

  render () {
    const { store } = this.props;

    if (!store.questionEvents.length) {
      return null;
    }

    return (
      <div className={ styles.eventsQuestions }>
        <table>
          { this.renderRows() }
        </table>
      </div>
    );
  }

  renderRows () {
    const { store, onClick } = this.props;

    return store.questionEvents.map((event) => {
      const index = parseInt(event.params.index, 10) + 1;
      const navigateTo = (event) => {
        store.loadQuestion(index);
        onClick && onClick(event);
      };

      return (
        <tr
          className={ event.state === 'pending' ? styles.pending : '' }
          key={ event.key }>
          <td className={ styles.blockNumber }>
            { formatBlockTimestamp(store.blocks, event.blockNumber) }
          </td>
          <td className={ styles.index }>
            #{ index }
          </td>
          <td className={ styles.question }>
            <a href='#' onClick={ navigateTo }>{ event.params.question }</a>
          </td>
        </tr>
      );
    });
  }
}
