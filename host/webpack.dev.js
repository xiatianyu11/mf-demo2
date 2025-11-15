const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

const remotes = {
  remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js"
};

module.exports = merge(common, {
  mode: "development",
  devServer: {
    port: 3000
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
  ],
  output: {
    publicPath: "http://localhost:3000/"
  }
});
