const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const deps = require("./package.json").dependencies;

const PORT = 8080;

module.exports = {
  mode: "development",
  target: "web",
  output: {
    publicPath: `http://localhost:${PORT}/`
  },
  devServer: {
    port: PORT,
    historyApiFallback: true
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
      remotes: {
        remote1: "remote1@http://localhost:8081/remoteEntry.js"
      },
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
