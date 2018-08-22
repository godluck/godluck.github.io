const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')

module.exports = function (_param) {
    let _entry = {}
    _entry[_param] = path.resolve(__dirname, `../src/${_param}/index.js`)
    return {
        entry: _entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, `../dist/${_param}`),
            publicPath: '',
        },
        resolve: {
            alias: {
                '@eos': path.resolve(__dirname, '../eos'),
                '@common': path.resolve(__dirname, '../common'),
                'es5-sham$': 'es5-shim/es5-sham',
                vue$: 'vue/dist/vue.esm.js',
            },
            extensions: ['.js', '.mjs', '.es'],
        },
        module: {
            rules: [
                {
                    test: /\.es6$/,
                    use: [
                        'script-loader',
                    ],
                },
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: 'es3ify-loader',
                    enforce: 'post'
                },
                {
                    test: /\.(eot|woff|woff2|svg|ttf|zip|mp3|mp4|flv|webm|ogv)$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.art$/,
                    loader: 'art-template-loader',
                    options: {
                        htmlResourceRules: [
                            /\bsrc="([^"]*)"/,
                            /\bdata-original="([^"]*)"/,
                        ],
                    },
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader',
                        },
                    },
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `../src/${_param}/index.html`),
                inlineSource: '.(js|css)$'
            }),
        ]
    }
}
