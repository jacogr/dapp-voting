// MIT License, Copyright 2016, Jaco Greeff <jacogr@gmail.com>

const HappyPack = require('happypack');
const path = require('path');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssVars = require('postcss-simple-vars');
const rucksack = require('rucksack-css');
const webpack = require('webpack');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const ENV = process.env.NODE_ENV || 'production';
const isProd = ENV === 'production';
const DEST = './';

module.exports = {
  debug: !isProd,
  cache: !isProd,
  devtool: isProd ? false : '#cheap-module-eval-source-map',
  context: path.join(__dirname, './src'),
  entry: {
    'index': ['./index.js']
  },
  output: {
    path: path.join(__dirname, DEST),
    filename: 'dist/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [ 'happypack/loader?id=js' ]
      },
      {
        test: /\.js$/,
        include: /node_modules\/material-ui-chip-input/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },

      {
        test: /\.css$/,
        include: [/src/],
        loaders: [ 'happypack/loader?id=css' ]
      },
      {
        test: /\.css$/,
        exclude: [/src/],
        loader: 'style!css'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader?name=dist/[hash].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=dist/[hash].[ext]'
      }
    ],
    noParse: [
      /node_modules\/sinon/
    ]
  },
  resolve: {
    root: path.join(__dirname, 'node_modules'),
    fallback: path.join(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true
  },
  resolveLoaders: {
    root: path.join(__dirname, 'node_modules'),
    fallback: path.join(__dirname, 'node_modules')
  },
  postcss: [
    postcssImport({
      addDependencyTo: webpack
    }),
    postcssNested({}),
    postcssVars({
      unknown: function (node, name, result) {
        node.warn(result, `Unknown variable ${name}`);
      }
    }),
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new HappyPack({
      id: 'css',
      threads: 4,
      loaders: [
        'style',
        'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }),
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: isProd ? ['babel'] : ['babel?cacheDirectory=true']
    }),
    new WebpackErrorNotificationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV)
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      screwIe8: true,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    })
  ],
  devServer: {
    contentBase: `./${DEST}`,
    historyApiFallback: false,
    quiet: false,
    hot: !isProd
  }
};
