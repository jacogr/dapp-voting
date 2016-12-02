// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import { api } from './parity';

import Button from './button';
import Modal from './modal';

import styles from './index.css';

const MAX_CHARACTERS = 160;

@observer
export default class ModalNewQuestion extends Component {
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

    let submitLabel = 'ask';
    if (store.questionFee.gt(0)) {
      submitLabel = <div>{ submitLabel }<div><small>({ api.util.fromWei(store.questionFee).toFormat(3) } ETH</small>)</div></div>;
    }

    return (
      <Modal
        buttons={ [
          <Button
            disabled={ questionCharactersLeft >= 156 || questionCharactersLeft < 0 }
            icon='question'
            label={ submitLabel }
            onClick={ this.onSubmit } />
        ] }
        title='submit a new question'
        onClose={ this.onClose }>
        <textarea
          placeholder='The actual question to ask'
          value={ question }
          onChange={ this.onChangeQuestion } />
        <div className={ `${styles.textareaInfo} ${questionCharactersLeft < 0 ? styles.error : ''}` }>
          { questionCharactersLeft } character{ questionCharactersLeft === 1 ? '' : 's'} remaining
        </div>
      </Modal>
    );
  }

  onChangeQuestion = (event) => {
    const value = event.target.value;
    const question = `${value.trim()}${value[value.length - 1] === ' ' ? ' ' : ''}`;
    const questionCharactersLeft = MAX_CHARACTERS - question.length;

    this.setState({ question, questionCharactersLeft });
  }

  onClose = () => {
    this.setState({ question: '', questionLength: 0 });
    this.props.store.toggleNewQuestionModal();
  }

  onSubmit = () => {
    this.props.store.newQuestion(this.state.question.trim());
    this.onClose();
  }
}
