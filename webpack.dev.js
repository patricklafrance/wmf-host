const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  target: "web",
  output: {
    publicPath: `http://localhost:8080/`
  },
  devServer: {
    port: 8080,
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
      // USELESS SINCE DOING THE DYNAMIC LOAD OURSELF TO DISPLAY A LOADING WHILE LOADING THE FRAGMENTS
      remotes: {
        remote1: "remote1@http://localhost:8081/remoteEntry.js"
      },
      shared: {
        "react": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react"]
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"]
        },
        "react-router-dom": { 
          singleton: true,
          eager: true,
          requiredVersion: deps["react-router-dom"]
        },
        "@sharegate/orbit-ui": {
          singleton: true,
          eager: true,
          requiredVersion: deps["@sharegate/orbit-ui"]
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
