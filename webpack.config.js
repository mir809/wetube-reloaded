const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    commentSection: BASE_JS + "commentSection.js",
    editProfile: BASE_JS + "editProfile.js",
    forms: BASE_JS + "forms.js",
    header: BASE_JS + "header.js",
    main: BASE_JS + "main.js",
    recorder: BASE_JS + "recorder.js",
    sideVar: BASE_JS + "sideVar.js",
    smallPlayer: BASE_JS + "smallPlayer.js",
    upload: BASE_JS + "upload.js",
    videoInfo: BASE_JS + "videoInfo.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    videosList: BASE_JS + "videosList.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
