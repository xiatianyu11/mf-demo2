const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const path = require("path");

module.exports = {
  entry: "./src/index",
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./Hello": "./src/Hello"
      },
      shared: {
        react: { singleton: true, eager: false },
        "react-dom": { singleton: true, eager: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
