// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/* eslint-disable no-undef */
module.exports = {
  mode: "production",

  entry: "./src/index.tsx",

  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
            plugins: ["@babel/plugin-syntax-jsx"]
          }
        }
      }
    ]
  },

  resolve: {
    extensions: [
      ".ts", ".tsx", ".js", ".json"
    ],
  },

  devServer: {
    contentBase: `${__dirname}/dist`,
    compress: true,
    port: 8000
  },

  performance: { hints: false },

  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
};
