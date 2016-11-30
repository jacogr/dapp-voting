// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import BigNumber from 'bignumber.js';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import styles from './status.css';

const { api } = window.parity;

@observer
export default class Status extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.count || store.totalVotes.eq(0)) {
      return null;
    }

    return (
      <div className={ styles.status }>
        { store.totalVotes.toFormat(0) } answers, total value of { api.util.fromWei(store.totalValue).toFormat(3) }<small>ETH</small> in { new BigNumber(store.count).toFormat(0) } question{ store.count === 1 ? '' : 's' }
      </div>
    );
  }
}
