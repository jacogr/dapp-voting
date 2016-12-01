// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';

import styles from './index.css';

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]).isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { className, disabled, icon, label } = this.props;

    return (
      <div className={ `${styles.button} ${className}` }>
        <button
          disabled={ disabled }
          onClick={ this.onClick }>
          <i className={ `fa fa-${icon}` } />
        </button>
        <div className={ styles.label }>
          { label }
        </div>
      </div>
    );
  }

  onClick = (event) => {
    if (this.props.disabled) {
      return;
    }

    this.props.onClick(event);
  }
}
