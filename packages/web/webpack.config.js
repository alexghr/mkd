const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const browserEntrypoint = resolve(__dirname, './src/main.tsx');
const outDir = resolve(__dirname, './build');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode,
  entry: {
    app: browserEntrypoint
  },
  output: {
    filename: '[name].js',
    path: outDir,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs']
  },
  module: {
    rules: [
      {
        include: /\.tsx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'public/*',
        flatten: true,
        globOptions: { gitIgnore: false },
        ignore: [
          "index.html",
          "config.sample.json"
        ]
      }
    ]),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html')
    })
  ]
};

module.exports = config;