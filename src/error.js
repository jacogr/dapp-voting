// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';

import styles from './index.css';

export default class Error extends Component {
  static propTypes = {
    error: PropTypes.object
  }

  render () {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div className={ styles.error }>
        { error.toString() }
      </div>
    );
  }
}
