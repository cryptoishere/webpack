const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const devServer = require('./dev-server.js');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
};

const filename = ext => isDev ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`;

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      filename: 'view/home/index.php',
      template: path.join(__dirname, 'src/index.php'),
      chunks: ['home'],
      // filename: 'index.[contenthash].php',
      inject: 'body',
      'meta': {
        // 'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#4285f4',
        // 'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src https:' },
        // 'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
      },
      minify: {
        collapseWhitespace: isProd,
        keepClosingSlash: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
        removeScriptTypeAttributes: isProd,
        removeStyleLinkTypeAttributes: isProd,
        useShortDoctype: isProd
      },
      // 'base': {
      //   'href': 'http://localhost/webpack/public/index.php',
      //   'target': '_blank'
      // }
      favicon: `../favicon.ico`,
      cspPlugin: {
        enabled: true,
        policy: {
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
          'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
        },
        hashEnabled: {
          'script-src': true,
          'style-src': true
        },
        nonceEnabled: {
          'script-src': true,
          'style-src': true
        },
        // processFn: defaultProcessFn  // defined in the plugin itself
      }
    }),

    new HTMLWebpackPlugin({
      filename: 'view/contact/contact.html',
      // publicPath: 'contact',
      template: path.join(__dirname, 'src/contact.pug'),
      chunks: ['contact', 'analytics'],
      inject: 'body',
      favicon: `../favicon.ico`,
      cspPlugin: {
        enabled: true,
        policy: {
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
          'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
        },
        hashEnabled: {
          'script-src': true,
          'style-src': true
        },
        nonceEnabled: {
          'script-src': true,
          'style-src': true
        },
        // processFn: defaultProcessFn  // defined in the plugin itself
      }
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        // { from: path.resolve(__dirname, 'favicon.ico'), to: "." },
        { from: "./app", to: "../../application/" },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new SubresourceIntegrityPlugin(),
    new CspHtmlWebpackPlugin({
      'base-uri': "'self'",
      'object-src': "'none'",
      'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
    }, {
      enabled: true,
      hashingMethod: 'sha256',
      hashEnabled: {
        'script-src': true,
        'style-src': true
      },
      nonceEnabled: {
        'script-src': true,
        'style-src': true
      },
      // processFn: defaultProcessFn  // defined in the plugin itself
    }),
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isProd ? 'production' : 'development',
  entry: {
    home: { import: ['./index.js', './scripts/analytics.ts']},
    contact: { import: './contact.js' },
    analytics: './scripts/analytics.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist/sub/public'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    filename: filename('js'),
    clean: true,
    crossOriginLoading: "anonymous",
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  // Optional
  // devServer: devServer,
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          (process.env.NODE_ENV === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    }
                  ],
                ],
              }
            }
          },
          "sass-loader"
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
          test: /\.m?ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }],
                ["@babel/preset-typescript"]
              ],
            }
          }
      },
    ]
  }
}
