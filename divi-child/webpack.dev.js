const webpack = require('webpack');

module.exports = {
  output: {
    publicPath: 'http://wink.ch.local:8080/',
  },
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0', // this lets the server listen for requests from the lan network, not just localhost.
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    compress: true,
    hot: true,
    allowedHosts: 'all',
    client: {
      logging: 'info',
    },
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
};
