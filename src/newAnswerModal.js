// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import AccountSelector from './AccountSelector';
import Button from './button';
import Modal from './modal';

const { api } = window.parity;

@observer
export default class NewQuestionModal extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.showNewAnswerModal) {
      return null;
    }

    let yesLabel = 'Yes. Yay. Ja.';
    let noLabel = 'No. Nay. Nein.';
    if (store.answerFee.gt(0)) {
      const answerFee = <small>{ api.util.fromWei(store.answerFee).toFormat(3) } ETH</small>;

      yesLabel = <span>{ yesLabel } ({ answerFee })</span>;
      noLabel = <span>{ noLabel } ({ answerFee })</span>;
    }

    return (
      <Modal
        buttons={ [
          <Button
            disabled={ store.hasCurrentVoted }
            label={ yesLabel }
            onClick={ this.onClickYes } />,
          <Button
            disabled={ store.hasCurrentVoted }
            label={ noLabel }
            onClick={ this.onClickNo } />
        ] }
        title={ `#${store.questionIndex}: ${store.question.question}` }
        onClose={ this.onClose }>
        <AccountSelector store={ store } />
      </Modal>
    );
  }

  onClose = () => {
    this.props.store.toggleNewAnswerModal();
  }

  onClickYes = () => {
    this.props.store.newAnswer(true);
    this.onClose();
  }

  onClickNo = () => {
    this.props.store.newAnswer(false);
    this.onClose();
  }
}
