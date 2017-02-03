'use strict';
const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = {
    watch: false,
    context: __dirname + '/',
    entry:  {
        common: './dev/common/js/common.js',
        'store-locator': './dev/pages/store-locator/store-locator.jsx',
		produits: './dev/pages/produits/produits.js'
    },
    output:  {
        path: __dirname + '/build',
        publicPath: '/js/',
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.js', '.styl', '.jsx'],
        modulesDirectories: [
            'node_modules',
            'bower_components'
        ],
        alias: {
            "jquery": "jquery/src/jquery",
            "slick-carousel": "slick-carousel/slick/slick.min.js",
            modules:  __dirname + '/node_modules'
        }
    },
    devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: "eslint",
            exclude: /\/node_modules\//
        }],
        loaders: [
            {
                test:   /\.(js|es6)$/,
                //exclude: /\/node_modules\/(\w*\/?)*\.(js)$/,
				include: [
					path.resolve(__dirname, 'dev'),
					path.resolve(__dirname, 'node_modules/googlemaps-js-rich-marker')
				],
                loader: "babel?presets[]=es2015"
            },
            {
                test: /\.jsx$/,
                query: {  presets: ['es2015', 'react'] },
                loader: 'babel-loader',
                exclude: /\/node_modules\//
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(jpe?g|png|gif)$/i, loader:"file"
            }
            // { test: /[\/]jquery\.js$/, loader: 'exports?jquery' }

        ]
        // noParse: /\/(node_modules)\/(jquery)/
    },

    plugins: [
        new CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            chunks: ['store-locator']
        }),
        new webpack.ProvidePlugin({
            $: "jquery/src/jquery",
            jQuery: "jquery/src/jquery",
            "window.jQuery": "jquery/src/jquery",
            React:    'react',
            ReactDOM: 'react-dom',
			ReactDOMServer: 'react-dom/server',
			Gsap: 'gsap'
        }),
        new ExtractTextPlugin("../css/vendor.css", {
            allChunks: true
        }),
        new webpack.NoErrorsPlugin()
    ],
    eslint: {
        failOnWarning: false,
        failOnError: true,
        configFile: './.eslintrc.js'
    },
    parserOptions: {
        "ecmaFeatures": {
            "modules": true
        }
    }
};
