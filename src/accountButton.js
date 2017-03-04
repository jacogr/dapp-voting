// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import Button from './button';

@observer
export default class AccountButton extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;
    const style = {};
    let label = null;

    if (store.currentAccount) {
      style.backgroundImage = `url(${api.util.createIdentityImg(store.currentAccount.address, 8)}`;

      label = store.currentAccount.name.length <= 8
        ? store.currentAccount.name
        : `${store.currentAccount.name.substr(0, 3)}..${store.currentAccount.name.slice(-3)}`;
    }

    return (
      <Button
        disabled={ !store.accounts || !store.accounts.length }
        label={ label }
        style={ style }
        onClick={ this.onClick } />
    );
  }

  onClick = () => {
  }
}
