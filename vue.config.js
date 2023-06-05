const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/var.scss";',
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@/": path.join(__dirname, "src/"),
        "@/views": path.join(__dirname, "src/views/"),
        "@/components": path.join(__dirname, "src/components/"),
        "@/assets": path.join(__dirname, "src/assets/"),
        "@/store": path.join(__dirname, "src/store/"),
        "@/utils": path.join(__dirname, "src/utils/"),
        "@/styles": path.join(__dirname, "src/styles/"),
        "@/router": path.join(__dirname, "src/router/"),
        "@/const": path.join(__dirname, "src/const/"),
        "@/plugins": path.join(__dirname, "src/plugins/"),
      },
      extensions: [".js", ".vue", ".json"],
    },
  },
  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set("@", path.join(__dirname, "src/"))
  //     .set("@/views", path.join(__dirname, "src/views/"))
  //     .set("@/components", path.join(__dirname, "src/components/"))
  //     .set("@/common", path.join(__dirname, "src/components/common/"))
  //     .set("@/assets", path.join(__dirname, "src/assets/"))
  //     .set("@/store", path.join(__dirname, "src/store/"))
  //     .set("@/utils", path.join(__dirname, "src/utils/"))
  //     .set("@/styles", path.join(__dirname, "src/styles/"))
  //     .set("@/router", path.join(__dirname, "src/router/"))
  //     .set("@/constants", path.join(__dirname, "src/const/"));
  // },
};
