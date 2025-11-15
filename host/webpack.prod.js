const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const path = require("path");

const remotes = {
  remoteApp: "remoteApp@https://cdn.yourdomain.com/remote/remoteEntry.js"
};

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "https://cdn.yourdomain.com/host/"
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes,
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ]
});
