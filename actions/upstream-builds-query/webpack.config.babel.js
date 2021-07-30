import path from "path"

export default {
  mode: "development",
  entry: "./index.js",
  target: "node",
  output: {
    path: path.resolve("dist"),
    filename: "[name].cjs",
  },
  resolve: { fallback: { fs: false, path: false, os: false } },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
      },
    ],
  },
}
