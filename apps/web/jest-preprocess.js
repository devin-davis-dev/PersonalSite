const babelOptions = {
  presets: [
    [
      "babel-preset-gatsby",
      {
        reactRuntime: "automatic",
        reactImportSource: "theme-ui",
      },
    ],
  ],
};

module.exports = require("babel-jest").default.createTransformer(babelOptions);
