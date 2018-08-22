const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const HtmlStringReplacePlugin = require('html-string-replace-webpack-plugin')

module.exports = function (_param) {
    return webpackMerge(new baseWebpackConfig(_param), {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 6144,
                                name: '[name].[ext]'
                            }
                        },
                    ],
                },
                {
                    test: /\.(css|scss)$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            'css-loader',
                            'postcss-loader',
                            'sass-loader',
                            {
                                loader: StringReplacePlugin.replace({
                                    replacements: [
                                        {
                                            pattern: /(background(-image)?:\s*url\(["']?about:\s*blank["']?\);)/g,
                                            replacement: function (match, p1, p2) {
                                                return `background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzIwREQ1OTA3RkY2MTFFNjg0NTdFN0I3NkU2OUEzRjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzIwREQ1OTE3RkY2MTFFNjg0NTdFN0I3NkU2OUEzRjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjBERDU4RTdGRjYxMUU2ODQ1N0U3Qjc2RTY5QTNGMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjBERDU4RjdGRjYxMUU2ODQ1N0U3Qjc2RTY5QTNGMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnxqktAAAAAQSURBVHjaYvj//z8DQIABAAj8Av7bok0WAAAAAElFTkSuQmCC");`
                                            },
                                        },
                                    ]
                                })
                            },
                        ],
                    }),
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                attrs: ['img:src', 'img:data-original']
                            }
                        },
                        {
                            loader: 'modulemarket-loader',
                        },
                        {
                            loader: StringReplacePlugin.replace({
                                replacements: [
                                    {
                                        pattern: /(src="" |src='' )/g,
                                        replacement: function (match, p1, p2) {
                                            return 'bia-src="" '
                                        },
                                    },
                                ]
                            })
                        },
                    ]
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new HtmlWebpackInlineSourcePlugin(),
            new StringReplacePlugin(),
            new ExtractTextPlugin({
                filename: '[name].css'
            }),
            new HtmlStringReplacePlugin({
                enable: true,
                patterns: [
                    {
                        match: /(")?img\/([\S\d]+\.(jpg|png|gif|jpeg|JPG|PNG|GIF|JPEG))(")?/g,
                        replacement: (match, $1, $2) => {
                            return `"${$2}"`;
                        }
                    },
                    {
                        match: /(')?img\/([\S\d]+\.(jpg|png|gif|jpeg|JPG|PNG|GIF|JPEG))(')?/g,
                        replacement: (match, $1, $2) => {
                            return `'${$2}'`;
                        }
                    },
                    {
                        match: /bia-src="" /g,
                        replacement: (match, $1, $2) => {
                            return `src="" `;
                        }
                    },
                ]
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ]
    })
}
