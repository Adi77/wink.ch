const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  output: {
    publicPath: '/wp-content/themes/divi-child/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })],
};
