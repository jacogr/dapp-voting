// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';

import styles from './modal.css';

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
        <div className={ styles.close } onClick={ onClose }>X</div>
        <div className={ styles.title }>
          { title }
        </div>
        <div className={ styles.content }>
          { children }
          <div className={ styles.buttons }>
            { buttons }
          </div>
        </div>
      </div>
    );
  }
}
