const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

// remote1 版本：替换下面三个常量即可
const REMOTE_NAME = "remote1";          // remote 唯一名称
const REMOTE_DEV_PORT = 3001;           // dev server 端口
const REMOTE_PROD_CDN = "https://cdn.example.com/remote1"; // CDN 根路径

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const fs = require("fs");

class GenerateMFManifestPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("GenerateMFManifestPlugin", compilation => {
      let remoteEntryUrl;

      if (compiler.options.mode === "development") {
        // dev 时没有 hash，直接 localhost
        remoteEntryUrl = `http://localhost:${REMOTE_DEV_PORT}/remoteEntry.js`;
      } else {
        // prod 时从构建结果中找到真实 hash 文件
        const remoteEntryFile = Object.keys(compilation.assets)
          .find(f => /^remoteEntry\..+\.js$/.test(f));

        remoteEntryUrl = `${REMOTE_PROD_CDN}/${remoteEntryFile}`;
      }

      const manifest = {
        [REMOTE_NAME]: remoteEntryUrl,
        buildTime: new Date().toISOString()
      };

      fs.writeFileSync(
        path.join(compiler.options.output.path, "mf-manifest.json"),
        JSON.stringify(manifest, null, 2)
      );

      console.log(`mf-manifest.json created: ${remoteEntryUrl}`);
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV || "development",

  entry: "./src/index.js",

  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
    clean: true
  },

  devServer: {
    port: REMOTE_DEV_PORT,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),

    new ModuleFederationPlugin({
      name: REMOTE_NAME,
      filename: process.env.NODE_ENV === "production"
        ? "remoteEntry.[contenthash].js"
        : "remoteEntry.js",

      exposes: {
        "./Page1": "./src/Page1.jsx",
        "./Page2": "./src/Page2.jsx"
      },

      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false }
      }
    }),

    // 🔥 自动生成 mf-manifest.json（最关键）
    new GenerateMFManifestPlugin()
  ]
};


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
    }),
    new GenerateMFManifestPlugin()
  ]
};
