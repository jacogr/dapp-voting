// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';

import Button from './button';

import styles from './index.css';

export default class Modal extends Component {
  static propTypes = {
    buttons: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  }

  render () {
    const { buttons, children, title, onClose } = this.props;

    return (
      <div className={ styles.modal }>
        <div className={ styles.close }>
          <Button
            icon='close'
            onClick={ onClose } />
        </div>
        <div className={ styles.title }>
          { title }
        </div>
        <div className={ styles.content }>
          { children }
          <div className={ styles.buttonRow }>
            { buttons }
          </div>
        </div>
      </div>
    );
  }
}
