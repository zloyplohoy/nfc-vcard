const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|mp3)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'registration-form',
            hash: true,
            favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
            template: path.resolve(__dirname, 'public', 'index.html')
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        hot: true,
        port: 80,
        open: true
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') config.devtool = 'source-map';

    return config;
};
