// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

import React, { Component, PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';

import styles from './index.css';

export default class Chart extends Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,
    title: PropTypes.string,
    values: PropTypes.array.isRequired
  }

  render () {
    const { labels, title, values } = this.props;

    return (
      <div className={ styles.chart }>
        <div className={ styles.chartTitle }>{ title }</div>
        <Doughnut
          data={ {
            labels,
            datasets: [ {
              data: values,
              backgroundColor: [
                '#4d4', '#d44', '#44d'
              ],
              hoverBackgroundColor: [
                '#4f4', '#f44', '#44f'
              ]
            } ]
          } }
          options={ {
            legend: {
              fontSize: 16
            }
          } }
          height={ 100 }
          width={ 100 } />
      </div>
    );
  }
}
