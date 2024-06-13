/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = env => {
    return {
        mode: 'development',
        entry: './src/app.jsx',
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },{
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        devServer: {
            contentBase: './dist',
            overlay: true,
            hot: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            // Inserting env variables into HTML:
            // https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
            // https://veerasundar.com/blog/2019/01/how-to-inject-environment-values-in-javascript-app-with-webpack/
            new HtmlWebpackPlugin({
                filename: 'index.html', 
                template: 'index.html',
                apiKey: env.API_KEY,
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            })
        ],
        devtool: "source-map",
    };
};

