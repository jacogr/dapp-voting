// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]).isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { className, disabled, label } = this.props;

    return (
      <button
        className={ className }
        disabled={ disabled }
        onClick={ this.onClick }>
        { label }
      </button>
    );
  }

  onClick = (event) => {
    if (this.props.disabled) {
      return;
    }

    this.props.onClick(event);
  }
}
