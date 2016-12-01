// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import Modal from './modal';

@observer
export default class ModalInfo extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.showInfoModal) {
      return null;
    }

    let questionValue = <b>is free</b>;
    if (store.questionFee.gt(0)) {
      questionValue = <b>requires a { api.util.fromWei(store.questionFee).toFormat(3) } <small>ETH</small> fee</b>;
    }

    let answerValue = <b>is free</b>;
    if (store.answerFee.gt(0)) {
      answerValue = <b>requires a { api.util.fromWei(store.answerFee).toFormat(3) } <small>ETH</small> fee</b>;
    }

    return (
      <Modal
        title='information center'
        onClose={ this.onClose }>
        <p>This is a simple distributed voting mechanism backed by a contract on the Ethereum network. Anybody can ask questions soliciting responses from the community.</p>
        <p>Asking a question is simple, simply use the <b><i className='fa fa-commenting' /> question</b> button, ask your question and it will be made available on the network.</p>
        <p>When you want to provide and answer to a question, use the <b><i className='fa fa-microphone' /> answer</b> button, and you are allowed to provide either a <b><i className='fa fa-thumbs-o-up' /> yes</b>, <b><i className='fa fa-thumbs-o-down' /> no</b> or <b><i className='fa fa-hand-paper-o' /> maybe</b> answer to the question.</p>
        <p>Once an answer is provided, the contract will record your answer as well as record the associated responder account balance against the answer. (Only value totals are stored against the responses, as well as storing only the final yes/no/maybe tally, not the actual per account response.) Answers cannot be edited and all questions allows only one answer per responder account.</p>
        <p>In addition to asking and answering questions, a simple interface is provided for browsing, either by finding a specific question by number or by retrieving a random question (in addition to the <b><i className='fa fa-arrow-left' /> prev</b> and <b><i className='fa fa-arrow-right' /> next</b> browsing)</p>
        <p>For some operations a very minimal contract fee may be required, asking a question { questionValue } and answering a question { answerValue }.</p>
      </Modal>
    );
  }

  onClose = () => {
    this.props.store.toggleInfoModal();
  }
}
