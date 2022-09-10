const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
var glob = require("glob");
const fs = require("fs");

const srcDir = path.join(__dirname, "../src");

const getFiles = (dirname) =>
  fs.readdirSync(`${srcDir}/${dirname}`).reduce(
    (acc, v) => ({
      ...acc,
      [`${dirname}/${v.split(".")[0]}`]: `${srcDir}/${dirname}/${v}`,
    }),
    {}
  );

module.exports = {
  entry: {
    popup: path.join(srcDir, "popup.tsx"),
    options: path.join(srcDir, "options.tsx"),
    background: path.join(srcDir, "background.ts"),
    content_script: path.join(srcDir, "content_script.tsx"),
    // ...getFiles('core'),
    // ...getFiles('helpers'),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
};
