const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const deps = require("./package.json").dependencies;

module.exports = {
  mode: "production",
  target: "web",
  cache: false,
  devtool: false,
  optimization: {
    minimize: true
  },
  output: {
    publicPath: "https://weback-module-federation-poc-host.netlify.app/",
    // publicPath: "http://localhost:8080/"",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js[x]$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
    alias: {
      "@core": path.resolve(__dirname, "src/core/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@layouts": path.resolve(__dirname, "src/layouts/"),
      "@pages": path.resolve(__dirname, "src/pages/")
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      // Don't need this since we use Dynamic Remote Contaniners: https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers
      // remotes: {
      //   remote1: "remote1@https://webpack-module-federation-poc-remote-1.netlify.app/remoteEntry.js"
      //   // remote1: "remote1@http://localhost:8081/remoteEntry.js"
      // },
      shared: {
        "react": {
          singleton: true,
          requiredVersion: deps["react"]
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"]
        },
        "react-router-dom": { 
          singleton: true,
          requiredVersion: deps["react-router-dom"]
        },
        "@sharegate/orbit-ui": {
          singleton: true,
          requiredVersion: deps["@sharegate/orbit-ui"]
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
