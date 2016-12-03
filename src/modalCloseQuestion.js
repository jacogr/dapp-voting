// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Button from './button';
import Modal from './modal';

@observer
export default class ModalCloseQuestion extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props;

    if (!store.showCloseQuestionModal) {
      return null;
    }

    return (
      <Modal
        buttons={ [
          <Button
            disabled={ !store.canClose }
            icon='lock'
            label='lock'
            onClick={ this.onClickTrash } />
        ] }
        title={ `lock question #${store.questionIndex}` }
        onClose={ this.onClose }>
        <p>The question owner can lock and close the question, disallowing any more answers. Historic results will still be visible and available for browsing. This operation is permanent and cannot be undone.</p>
        <p>Are you sure you want to close this question?</p>
      </Modal>
    );
  }

  onClose = () => {
    this.props.store.toggleCloseQuestionModal();
  }

  onClickTrash = () => {
    this.props.store.closeQuestion();
    this.onClose();
  }
}
