// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Button from './button';
import EventsNewQuestion from './eventsNewQuestion';
import Modal from './modal';

import styles from './index.css';

@observer
export default class ModalSearch extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  state = {
    index: 1
  }

  render () {
    const { store } = this.props;

    if (!store.showSearchModal) {
      return null;
    }

    return (
      <Modal
        title='find question by index'
        onClose={ this.onClose }>
        <input
          type='number'
          min={ 1 }
          max={ store.count }
          step={ 1 }
          value={ this.state.index }
          onChange={ this.changeIndex } />
        <div className={ styles.buttonRow }>
          <Button
            icon='search'
            label='find'
            onClick={ this.onClickSearch } />
        </div>
        <EventsNewQuestion
          store={ store }
          onClick={ this.onClose } />
      </Modal>
    );
  }

  onClose = () => {
    this.props.store.toggleSearchModal();
  }

  onClickSearch = () => {
    this.props.store.loadQuestion(this.state.index);
    this.onClose();
  }

  changeIndex = (event) => {
    this.setState({ index: parseInt(event.target.value, 10) });
  }
}
