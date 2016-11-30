// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';

import styles from './chart.css';

export default class Chart extends Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired
  }

  render () {
    const { labels, values } = this.props;

    return (
      <div className={ styles.chart }>
        <Doughnut
          data={ {
            labels,
            datasets: [ {
              data: values,
              backgroundColor: [
                '#4f4', '#f44'
              ],
              hoverBackgroundColor: [
                '#1f1', '#f11'
              ]
            } ]
          } }
          options={ {} }
          height={ 100 }
          width={ 100 } />
      </div>
    );
  }
}
