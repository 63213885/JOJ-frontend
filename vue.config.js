const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: [
          "cpp",
          "java",
          "python",
          "go",
          "javascript",
          "typescript",
          "c",
        ],
      }),
    ],
  },
  devServer: {
    host: "0.0.0.0",
    port: 6310,
    allowedHosts: ["joj.ac.cn"],
  },
});
