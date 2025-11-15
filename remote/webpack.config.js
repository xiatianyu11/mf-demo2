const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = {
  mode: "development",
  devServer: {
    port: 3001,
  },
  entry: "./src/index",
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote1",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App"
         //"./Hello": "./src/Hello",
         //"./World": "./src/World"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
