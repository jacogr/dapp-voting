// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import AccountSelector from './AccountSelector';
import Button from './button';
import Modal from './modal';

@observer
export default class ModalNewAnswer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.showNewAnswerModal) {
      return null;
    }

    let yesLabel = 'yes';
    let noLabel = 'no';
    let maybeLabel = 'maybe';
    if (store.answerFee.gt(0)) {
      const answerFee = <small>{ api.util.fromWei(store.answerFee).toFormat(3) } ETH</small>;

      yesLabel = <div>{ yesLabel }<div>({ answerFee })</div></div>;
      noLabel = <div>{ noLabel }<div>({ answerFee })</div></div>;
      maybeLabel = <div>{ maybeLabel }<div>({ answerFee })</div></div>;
    }

    return (
      <Modal
        buttons={ [
          <Button
            disabled={ store.hasCurrentVoted }
            icon='thumbs-o-up'
            label={ yesLabel }
            onClick={ this.onClickYes } />,
          <Button
            disabled={ store.hasCurrentVoted }
            icon='hand-paper-o'
            label={ maybeLabel }
            onClick={ this.onClickMaybe } />,
          <Button
            disabled={ store.hasCurrentVoted }
            icon='thumbs-o-down'
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
    this.props.store.newAnswer(1);
    this.onClose();
  }

  onClickNo = () => {
    this.props.store.newAnswer(0);
    this.onClose();
  }

  onClickMaybe = () => {
    this.props.store.newAnswer(2);
    this.onClose();
  }
}
