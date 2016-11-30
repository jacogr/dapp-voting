// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import AccountSelector from './AccountSelector';
import Button from './button';
import Modal from './modal';

import styles from './newQuestionModal.css';

const { api } = window.parity;

const MAX_CHARACTERS = 160;

@observer
export default class NewQuestionModal extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  state = {
    question: '',
    questionCharactersLeft: MAX_CHARACTERS
  }

  render () {
    const { store } = this.props;
    const { question, questionCharactersLeft } = this.state;

    if (!store.showNewQuestionModal) {
      return null;
    }

    let submitLabel = 'submit';
    if (store.questionFee.gt(0)) {
      submitLabel = <span>{ submitLabel } (<small>{ api.util.fromWei(store.questionFee).toFormat(3) } ETH</small>)</span>;
    }

    return (
      <Modal
        buttons={ [
          <Button
            disabled={ questionCharactersLeft >= 156 || questionCharactersLeft < 0 }
            label={ submitLabel }
            onClick={ this.onSubmit } />
        ] }
        title='submit a new question'
        onClose={ this.onClose }>
        <AccountSelector store={ store } />
        <textarea
          placeholder='The actual question to ask'
          value={ question }
          onChange={ this.onChangeQuestion } />
        <div className={ `${styles.lengthCount} ${questionCharactersLeft < 0 ? styles.error : ''}` }>
          { questionCharactersLeft } character{ questionCharactersLeft === 1 ? '' : 's'} remaining
        </div>
      </Modal>
    );
  }

  onChangeQuestion = (event) => {
    const question = event.target.value.trim();
    const questionCharactersLeft = MAX_CHARACTERS - question.length;

    this.setState({ question, questionCharactersLeft });
  }

  onClose = () => {
    this.setState({ question: '', questionLength: 0 });
    this.props.store.toggleNewQuestionModal();
  }

  onSubmit = () => {
    this.props.store.newQuestion(this.state.question);
    this.onClose();
  }
}
