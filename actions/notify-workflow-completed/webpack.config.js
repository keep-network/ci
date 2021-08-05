const path = require("path")

module.exports = {
  mode: "development",
  entry: "./index.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: { fallback: { fs: false, path: false, os: false } },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: "12",
                },
              },
            ],
          ],
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties",
          ],
        },
      },
    ],
  },
}
