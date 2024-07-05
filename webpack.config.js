// webpack.config.js
import { resolve as _resolve } from 'path';

export const entry = './index.js';
export const output = {
  path: _resolve(__dirname, 'dist'),
  filename: 'bundle.js',
};
export const module = {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    },
  ],
};
export const resolve = {
  extensions: ['.js', '.jsx'],
};
