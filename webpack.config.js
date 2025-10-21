const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    
    entry: {
      popup: path.resolve('src/popup/popup.ts'),
      content: path.resolve('src/content/content-script.ts'),
      background: path.resolve('src/background/service-worker.ts'),
      sidepanel: path.resolve('src/ui/sidepanel/sidepanel.ts')
    },
    
    output: {
      path: path.resolve('dist'),
      filename: '[name].js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        }
      ]
    },
    
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve('src'),
        '@components': path.resolve('src/components'),
        '@services': path.resolve('src/services'),
        '@utils': path.resolve('src/utils'),
        '@types': path.resolve('src/types'),
        '@config': path.resolve('src/config')
      }
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve('manifest.json'),
            to: path.resolve('dist/manifest.json')
          },
          {
            from: path.resolve('assets/icons'),
            to: path.resolve('dist/assets/icons')
          },
          {
            from: path.resolve('src/popup/popup.html'),
            to: path.resolve('dist/popup.html')
          },
          {
            from: path.resolve('src/popup/popup.css'),
            to: path.resolve('dist/popup.css')
          }
        ]
      }),
      
      new HtmlPlugin({
        template: path.resolve('src/popup/popup.html'),
        filename: 'popup.html',
        chunks: ['popup'],
        minify: isProduction
      })
    ],
    
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ],
      
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            reuseExistingChunk: true
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }
    },
    
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000
    },
    
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };
};
