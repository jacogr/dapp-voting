// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import Modal from './modal';

import styles from './index.css';

@observer
export default class ModalAccountSelector extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.showAccountModal) {
      return null;
    }

    return (
      <Modal
        title='select active account'
        onClose={ this.onClose }>
        <table className={ styles.accountSelector }>
          <tbody>
            { this.renderAccounts() }
          </tbody>
        </table>
      </Modal>
    );
  }

  renderAccounts () {
    const { store } = this.props;
    const current = store.currentAccount.address;

    return store.accounts.map((account) => {
      const onClick = () => {
        store.setCurrentAccount(account.address);
        this.onClose();
      };

      return (
        <tr
          key={ account.address }
          className={ account.address === current ? styles.selected : null }
          onClick={ onClick }>
          <td>
            <img
              className={ styles.image }
              src={ api.util.createIdentityImg(account.address, 8) } />
          </td>
          <td>
            <div className={ styles.name }>
              { account.name }
            </div>
            <div className={ styles.address }>
              { account.address }
            </div>
          </td>
        </tr>
      );
    });
  }

  onClose = () => {
    this.props.store.toggleAccountModal();
  }
}
