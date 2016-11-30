// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import styles from './index.css';

@observer
export default class EventsNewAnswer extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired
  }

  render () {
    const { events } = this.props;

    if (!events.length) {
      return null;
    }

    return (
      <div className={ styles.events }>answer events goes here</div>
    );
  }
}
