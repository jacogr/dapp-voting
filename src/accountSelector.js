// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export default class AccountSelector extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    return (
      <select
        value={ this.props.store.currentAccount.address }
        onChange={ this.onSelect }>
        { this.renderOptions() }
      </select>
    );
  }

  renderOptions () {
    return this.props.store.accounts.map((account) => {
      return (
        <option value={ account.address } key={ account.address }>
          { account.name } ({ this.trimAddress(account.address) })
        </option>
      );
    });
  }

  trimAddress (address) {
    return `${address.substr(0, 10)}...${address.slice(-8)}`;
  }

  onSelect = (event) => {
    this.props.store.setCurrentAccount(event.target.value);
  }
}
